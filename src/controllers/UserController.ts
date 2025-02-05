// src/controllers/UserController.ts
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest'; // Adjust the import based on your project structure
import { AppDataSource } from '../data-source';
import { User } from '../entities/UserEntity';
import { UserService } from '../services/UserService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import { sendTestEmail, sendInvitationToOnboard, sendResetPasswordEmail, sendTwoFactorCodeEmail, sendVerificationEmail } from '../lib/emailActions';
import { v4 as uuidv4 } from 'uuid'; // For generating verification tokens
import { FRONTEND_LOGIN } from '../config';
import axios from 'axios'; // Add axios for HTTP requests
import pdfParse from 'pdf-parse';
import * as XLSX from 'xlsx';
import { AccountStatus, OnboardingStatus, UserRole } from '../constants';
import { HotelService } from '../services/HotelService';
// import { format } from 'date-fns';

const userService = new UserService();
const userRepository = AppDataSource.getRepository(User);

// Multer configuration for handling file uploads
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage }).single('file'); // Single file upload under 'file' field

// Define the batch size (number of users to process per batch)
const BATCH_SIZE = 10;
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class UserController {

  constructor() {
    this.register = this.register.bind(this);
    this.bulkUploadUsers = this.bulkUploadUsers.bind(this);
  }

  public async testEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
  
      // Validate the email field
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      // Call the sendTestEmail function to send the email
      // await sendTestEmail(email);

      const firstName =  "Shafi";
      const password = "Test@123";
      await sendInvitationToOnboard({
        email,
        firstName,
        loginLink: `${FRONTEND_LOGIN}`,
        temporaryPassword: password
      });
  
      // Respond with a success message
      return res.status(200).json({ message: 'Test email sent successfully' });
    } catch (error) {
      console.error('Error sending test email:', error);
      return res.status(500).json({ message: 'Error sending test email', error: error.message });
    }
  }


  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { firstName, lastName, email, password, role, actionType, username } = req.body;
  
      if (!actionType) {
        return res.status(400).json({ message: 'Action Type field is missing' });
      }
  
      if (!username) {
        return res.status(400).json({ message: 'Username field is missing' });
      }
  
      // Normalize email and username
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedUsername = username.trim().toLowerCase();
  
      // Check if password is empty; if so, generate a temporary password
      const effectivePassword = password ? password : uuidv4().slice(0, 8);
  
      // Check if the user already exists in the same tenant
      const existingUserByEmail = await userService.findByEmail(normalizedEmail);
      if (existingUserByEmail) {
        return res.status(400).json({ message: 'User with this email already exists in the specified hotel' });
      }
  
      // Check if the username already exists in the same tenant
      const existingUserByUsername = await userService.findByUsername(normalizedUsername);
      if (existingUserByUsername) {
        return res.status(400).json({ message: 'Username already exists in the specified hotel' });
      }
  
      // Generate application number (e.g., Employee ID)
      const employeeId = await this.generateTenantId(role);
  
      // Hash the effective password
      const hashedPassword = await bcrypt.hash(effectivePassword, 10);
  
      // Create new user for the specified hotel
      const verificationToken = uuidv4();
      const newUser = await userService.create({
        firstName,
        lastName,
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        verificationToken,
        employeeId,
      });
  
      // Send relevant email based on creator
      await this.sendRelevantEmail(actionType, { email: normalizedEmail, firstName, password: effectivePassword, role, verificationToken });
  
      return res.status(200).json({
        statusCode: 200,
        message: `${role} registered successfully and an email has been sent.`,
      });
    } catch (error) {
      console.error('Error during registration:', error);
      return !res.headersSent
        ? res.status(500).json({ message: 'Server error', error: error.message })
        : undefined;
    }
  }
  

  public async registerAndSendVerificationCode(req: Request, res: Response) {
    try {
      const { email, firstName, lastName, password, loginType, username } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: 'User email is required' });
      }
  
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
  
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }
  
      const role = UserRole.Admin;
  
      // Generate TenantID number (e.g., TenantID)
      const tenantId = await UserService.generateTenantId(role);
  
      const dataToSave = {
        firstName,
        lastName,
        email,
        username,
        role,
        isVerified: true,
        tenantId
      }
  
      // Normalize email and username
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedUsername = username.trim().toLowerCase();
  
      // Check if the user already exists
      let user = await userService.findByEmail(normalizedEmail);
  
      if (!user) {
        // Check if the username already exists in the same tenant
        const existingUserByUsername = await userService.findByUsername(normalizedUsername);
        if (existingUserByUsername) {
          return res.status(400).json({ message: 'Username already exists in the specified hotel' });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // If user does not exist, create a new user with the email
        user = await userService.create({ ...dataToSave, password: hashedPassword, username: normalizedUsername });
      }
  
      const userId = user.id;
  
      // Generate and send the two-factor token
      await userService.generateAndSendTwoFactorToken(userId, loginType);
  
      res.status(200).json({ message: 'Verification code sent' });
    } catch (error) {
      console.error('Error registering and sending verification code:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  

  private async generateTenantId(role: string): Promise<string> {
    const prefix = role === 'admin' ? 'h' : 'emp';
    const uniqueId = uuidv4().slice(0, 8).toUpperCase(); // Unique part of the application number
    return `${prefix}-${uniqueId}`;
  }
  
  private async uploadProfilePicture(file: Express.Multer.File | undefined): Promise<string> {
    if (!file) return '';

    try {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    } catch (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      throw new Error('Failed to upload profile picture');
    }
  }

  private async sendRelevantEmail(actionType: string, { email, firstName, password, verificationToken }: any): Promise<void> {
    try {
      if (actionType === 'setup') {
        await sendVerificationEmail({ email, firstName, temporaryPassword: password },  verificationToken);
      } else {
        await sendInvitationToOnboard({
          email,
          firstName,
          loginLink: `${FRONTEND_LOGIN}`,
          temporaryPassword: password
        });
        
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      throw new Error('Failed to send email');
    }
  }

  public async forgetPassword(req: Request, res: Response) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                statusCode: 400,
                message: 'Email is required' 
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await userService.findByEmail(normalizedEmail);

        if (!user) {
            return res.status(404).json({ 
                statusCode: 404,
                message: 'User not found' 
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
        await userService.updateData(user);

        await sendResetPasswordEmail({ email: user.email, firstName: user.firstName }, resetToken);

        res.status(200).json({ 
            statusCode: 200,
            message: 'Password reset email sent' 
        });
    } catch (error) {
        console.error('Error during forget-password:', error);
        res.status(500).json({ 
            statusCode: 500,
            message: 'Server error', 
            error: error.message 
        });
    }
  }

  public async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
      }

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const user = await userService.findByResetToken(hashedToken);
      if (!user || user.resetPasswordExpires < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPassword = true;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.accountStatus = AccountStatus.Active;
      await userService.updateData(user);

      res.status(200).json({ statusCode: 200, message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Error during reset-password:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  public async toggleTwoFactor(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const user = await userService.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.twoFactorEnabled) {
        // Disable 2FA
        user.twoFactorEnabled = false;
        user.twoFactorToken = null;
        user.twoFactorExpires = null;
        await userService.updateData(user);
        res.status(200).json({ message: 'Two-factor authentication has been disabled' });
      } else {
        // Enable 2FA
        const twoFactorToken = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedToken = crypto.createHash('sha256').update(twoFactorToken).digest('hex');

        user.twoFactorToken = hashedToken;
        user.twoFactorExpires = new Date(Date.now() + 300000); // 5 minutes from now
        user.twoFactorEnabled = true;
        await userService.updateData(user);

        await sendTwoFactorCodeEmail({ email: user.email, firstName: user.firstName }, twoFactorToken);
        res.status(200).json({ message: 'Two-factor authentication has been enabled. A verification code has been sent to your email.' });
      }
    } catch (error) {
      console.error('Error toggling two-factor authentication:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  public async generateTwoFactorToken(req: Request, res: Response) {
    try {
      const { email, loginType } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: 'User email is required' });
      }
  
      // Find the user by email
      const user = await userService.findByEmail(email);
      console.log(user);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userId = user.id;
  
      // Generate and send the two-factor token
      await userService.generateAndSendTwoFactorToken(userId, loginType);
  
      res.status(200).json({ message: 'Two-factor authentication token sent' });
    } catch (error) {
      console.error('Error generating two-factor token:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Admin endpoint to upload Excel file
  public async bulkUploadUsers(req: Request, res: Response) {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file', error: err.message });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      try {
        // Parse the uploaded Excel file
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);
  
        // Define batch size
        const batchSize = 50; // Process 50 users at a time, adjust as needed
        const batches = [];
  
        // Split rows into batches
        for (let i = 0; i < rows.length; i += batchSize) {
          batches.push(rows.slice(i, i + batchSize));
        }
  
        // Process each batch
        for (const batch of batches) {
          // Create an array to store emails to be sent later
          const emailPromises = [];
  
          for (const row of batch) {
            const { 
              firstName, 
              lastName, 
              email, 
              phoneNumber, 
              role, 
              profilePicture, 
              createdBy 
            } = row as {
              firstName: string;
              lastName: string;
              email: string;
              phoneNumber: string;
              role: string;
              profilePicture: string;
              createdBy: string;
            };
  
            // Validate the required fields
            if (!firstName || !lastName || !email || !phoneNumber) {
              continue; // Skip rows with missing data
            }
  
            const normalizedEmail = email.trim().toLowerCase();
  
            // Check if user already exists
            const existingUser = await userService.findByEmail(normalizedEmail);
            if (existingUser) {
              continue; // Skip existing users
            }
  
            // Generate application number and temporary password
            const employeeId = await this.generateTenantId(role);
            const temporaryPassword = uuidv4().slice(0, 8); // Generate a temporary password
  
            // Hash the temporary password
            const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
  
            // Get the current date
            const createdAt = new Date();
            // Create new user with hashed password and createdAt field
            await userService.create({
              firstName,
              lastName,
              email: normalizedEmail,
              phoneNumber,
              password: hashedPassword, // Save the hashed password
              role: UserRole.FrontDesk,
              profilePicture,
              createdBy,
              createdAt,
              employeeId
            });
  
            // Add email sending promise to the array (for later execution)
            emailPromises.push(
              sendInvitationToOnboard({
                email: normalizedEmail,
                firstName,
                loginLink: `${FRONTEND_LOGIN}`,
                temporaryPassword
              })
            );
          }
  
          // Execute all email promises after processing the batch
          // Catch errors to prevent the process from stopping if email fails
          Promise.allSettled(emailPromises).then((results) => {
            results.forEach((result, index) => {
              if (result.status === 'rejected') {
                console.error(`Failed to send email for batch ${index}:`, result.reason);
              }
            });
          });
        }
  
        return res.status(200).json({ message: 'Users uploaded and invitations queued for sending' });
  
      } catch (error) {
        console.error('Error processing Excel file:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
      }
    });
  }

  public async login(req: Request, res: Response) {
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const userRepository = AppDataSource.getRepository(User);
      const { email, username, password, tenantId } = req.body;
  
      let user: User;
  
      if (email) {
        // Find user by email
        user = await userRepository.findOne({ where: { email } });
      } else if (username && tenantId) {
        // Find user by username and tenantId
        user = await userRepository.findOne({ where: { username, tenantId } });
      }
  
      if (!user) {
        return res.status(400).json({ statusCode: 400, message: 'Invalid credentials' });
      }
  
      // Check if password is correct
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ statusCode: 400, message: 'Invalid credentials' });
      }
  
      // Check if user email is verified
      if (!user.isVerified) {
        return res.status(400).json({ statusCode: 400, message: 'Email is not verified' });
      }
  
      // Check if user account is active
      if (!user.accountStatus) {
        return res.status(401).json({ statusCode: 401, message: 'Account is not active' });
      }        
  
      // Ensure JWT secret is defined
      if (!secret) {
        throw new Error('JWT secret key is not defined');
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '1h' });
  
      const hotelData = await HotelService.getHotelById(user.hotelId);
  
      // Respond with token and user info
      res.status(200).json({
        statusCode: 200,
        token,
        user: {
          userId: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          resetPassword: user.resetPassword,
          onboardingStep: user.onboardingStep,
          tenantId: user.tenantId,
          hotelId: user.hotelId,
          hotelName: hotelData.name,
          profilePicture: user?.profilePicture,
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
    }
  }
  
  
  public async verifyTwoFactorCode(req: Request, res: Response) {
    try {
      const { email, twoFactorCode } = req.body;
      console.log(email, twoFactorCode)
  
      if (!email || !twoFactorCode) {
        return res.status(400).json({ statusCode: 400, message: 'User email and two-factor code are required' });
      }
  
      const user = await userService.findOneAndUpdate(
        { email, twoFactorToken: twoFactorCode, twoFactorExpires: new Date() },
        { twoFactorToken: null, twoFactorExpires: null },
        { returnNewDocument: true }
      );
  
      if (!user) {
        return res.status(400).json({ statusCode: 400, message: 'User not found or invalid two-factor code' });
      }
  
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      if (!secret) {
        throw new Error('JWT secret key is not defined');
      }
  
      const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '1h' });
  
      res.status(200).json({
        statusCode: 200,
        token,
        user: {
          userId: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Error verifying two-factor code:', error);
      res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
    }
  }

  public async updateProfile(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const { userId } = req.params;
      const { firstName, lastName, country, stateOrProvince, postalCode, city, email, phoneNumber } = req.body;
      const file = req.file;

      const user = await userRepository.findOneBy({ id: parseInt(userId, 10) });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (file) {
        const result = await cloudinary.uploader.upload(file.path);
        user.profilePicture = result.secure_url;
        console.log('Uploaded profile picture to Cloudinary:', user.profilePicture);
      }

      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (email !== undefined) user.email = email;

      await userRepository.save(user);

      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  public async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.body?.id; // Access the userId from req.user
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user ID found' });
      }
  
      const user = await userService.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        user: {
          userId: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accountStatus: user.accountStatus,
        },
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  
  public async changeUserRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = parseInt(req.params.userId, 10); // Convert string to number
    const { role } = req.body;

    try {
      // Validate input
      if (isNaN(userId) || !role) {
        res.status(400).json({ message: 'User ID (number) and role are required' });
        return; // Ensure we return to avoid further execution
      }

      // Validate role
      const allowedRoles = ['admin', 'user', 'manager']; // Adjust roles as necessary
      if (!allowedRoles.includes(role)) {
        res.status(400).json({ message: 'Invalid role' });
        return; // Ensure we return to avoid further execution
      }

      // Update user role
      const updatedUser = await userService.updateUserRole(userId, role);

      if (updatedUser) {
        res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      // Use next to pass error to the error-handling middleware
      next(error);
    }
  }
  
  // Get all users
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get user by ID
  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await userService.getById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update user
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.id, 10);
      
      // Validate userId
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const userData = { ...req.body };
  
      // Handle password updates securely by hashing
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }
  
      const updatedUser = await userService.update(userId, userData);
  
      // Check if user exists
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete user
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      await userService.delete(userId);
      res.status(204).send(); // No content
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  public async verifyEmail(req: Request, res: Response): Promise<Response> {
    const verifyToken = req.query.token as string;

    if (!verifyToken) {
      return res.status(400).json({ message: 'Verification token is missing' });
    }

    try {
      const user = await userService.findByVerificationToken(verifyToken);
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }

      // Check if the user is already verified
      if (user.isVerified) {
        return res.status(200).json({ message: 'Email is already verified' });
      }

      // Proceed with verification
      user.isVerified = true; // Assume there's a field to mark user as verified
      user.verificationToken = null; // Clear the verification token
      await userService.updateData(user);

      return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
      console.error('Error during email verification:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

    // Update onboarding step controller
    public async updateOnboardingStep(req: Request, res: Response) {
      const { tenantId, onboardingStep } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      try {
          // Validate input
          if (!tenantId || onboardingStep === undefined) {
              return res.status(400).json({
                  message: "Application number and onboarding step are required",
              });
          }

          // Find the user by application number
          const user = await UserService.findTenantId(tenantId);

          if (!user) {
              return res.status(404).json({
                  message: "User not found",
              });
          }

          // Update the onboarding step
          user.onboardingStep = onboardingStep;

          // Save the updated user
          const updatedUser = await userRepository.save(user);

          return res.status(200).json({
              statusCode: 200,
              message: "Onboarding step updated successfully",
              onboardingStep: updatedUser.onboardingStep,
          });
      } catch (error) {
          console.error("Error updating onboarding step:", error);
          return res.status(500).json({
              message: "Server error",
              error: error.message,
          });
      }
  };


}

export default new UserController();
