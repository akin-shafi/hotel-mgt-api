import { LessThan, MoreThan } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/UserEntity';
import { UserRole } from '../constants';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendTwoFactorCodeEmail, sendLoginLink } from '../lib/emailActions';
import { AccountStatus } from '../constants';
import { v4 as uuidv4 } from 'uuid'; // For generating verification tokens


export const userRepository = AppDataSource.getRepository(User);

export class UserService {
  

  static register(arg0: { firstName: any; otherName: any; surname: any; country: any; stateOfOrigin: any; LGA: any; maritalStatus: any; employmentStatus: any; email: any; telephone: any; profilePicture: string; role: any; password: any; accountStatus: any; createdAt: any; updatedAt: any; }) {
    throw new Error('Method not implemented.');
  }

  static async findTenantId(tenantId: string) {
    return await userRepository.findOneBy({ tenantId });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return token;
  }

  async findByVerificationToken(verifyToken: string): Promise<User | null> {
    return userRepository.findOne({ where: { verificationToken: verifyToken } });
  }

  async verifyUser(verifyToken: string): Promise<User> {
    const user = await this.findByVerificationToken(verifyToken);

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = null; // Clear the token

    await userRepository.save(user);
    return user;
  }

  async updateProfile(id: number, updatedData: Partial<User>): Promise<void> {
    const user = await userRepository.findOneBy({id});
    
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updatedData); // Update user fields

    await userRepository.save(user);
  }

  async updateUserRole(id: number, role: UserRole) {
      const userRepository = AppDataSource.getRepository(User);

      try {
          // Find the user by ID
          const user = await userRepository.findOneBy({id});
          if (!user) {
              return null;
          }

          // Update the user role
          user.role = role;
          await userRepository.save(user);

          return user;
      } catch (error) {
          console.error('Error updating user role in service:', error);
          throw error;
      }
  }

  async findOneAndUpdate(
    filter: { email: string; twoFactorToken: string; twoFactorExpires: Date },
    update: { twoFactorToken: null; twoFactorExpires: null },
    options: { returnNewDocument: boolean }
  ): Promise<User | null> {
    try {
      // Find the user by email and two-factor token, and ensure the two-factor code has not expired
      const user = await userRepository.findOne({
        where: {
          email: filter.email,
          twoFactorToken: filter.twoFactorToken,
          twoFactorExpires: MoreThan(new Date()), // Use MoreThan for date comparison
        },
      });
  
      if (!user) {
        console.log('User not found or two-factor token is invalid');
        return null; // User not found or two-factor token is invalid
      }
  
      // If accountStatus is false, set it to true
      if (!user.accountStatus) {
        console.log('Activating user account');
        user.accountStatus = AccountStatus.Active;
      }
  
      // Update the user's two-factor token and expiration
      if (options.returnNewDocument) {
        console.log('Updating user with new values:', {
          twoFactorToken: update.twoFactorToken,
          twoFactorExpires: update.twoFactorExpires,
        });
  
        user.twoFactorToken = update.twoFactorToken;
        user.twoFactorExpires = update.twoFactorExpires;
        await userRepository.save(user); // Save the updated user
        console.log('User updated successfully');
      }
  
      return user;
    } catch (error) {
      console.error('Error in findOneAndUpdate:', error);
      throw new Error('Error updating user');
    }
  }
  
  async  findById(userId: number): Promise<User | null> {
    try {
      // Find the user by ID
      const user = await userRepository.findOne({where: { id: userId }});
  
      return user || null; // Return null if user is not found
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Error retrieving user');
    }
  }

  // Get all users
  async getAll(): Promise<User[]> {
    return userRepository.find();
  }

  // async getAllByStatus(status?: accountStatus): Promise<User[]> {
  //   return userRepository.createQueryBuilder('user')
  //       .where('user.accountStatus = :status', { status })
  //       .getMany();
  // }

  async getAllByStatus(status?: AccountStatus): Promise<User[]> {
    return userRepository.createQueryBuilder('user')
        .where('user.accountStatus = :status', { status })
        .getMany();
  }

  async findByStatus(accountStatus?: AccountStatus) {
      return await userRepository.find({ where: { accountStatus } }); // Adjust based on your ORM/DB library
  }

  async findByStatusAndRole(status: AccountStatus, role: UserRole) {
      // const userRepository = getRepository(User);

      // Find users by onboarding status and role
      const users = await userRepository.find({
          where: {
              accountStatus: status,
              role: role,
          },
      });

      return users;
  }

  // Get user by ID
  async getById(id: number): Promise<User | null> {
    return userRepository.findOneBy({ id });
  }

  // Create new user
  async create(userData: Partial<User>): Promise<User> {
    const user = userRepository.create(userData);
    return userRepository.save(user);
  }

  // Update user
  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await userRepository.findOneBy({ id });
    if (user) {
      Object.assign(user, userData);
      return userRepository.save(user);
    }
    return null;
  }

  // Delete user
  async delete(id: number): Promise<void> {
    await userRepository.delete(id);
  }
 

  async findByEmail(email: string): Promise<User | null> {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      console.log(`Searching for user with email: ${normalizedEmail}`); // Debugging
      return await userRepository.findOne({ where: { email: normalizedEmail } });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Could not find user by email');
    }
  } 

  // async findByEmailAndTenant(email: string, tenantId: string): Promise<User | null> {
  //   try {
  //     const normalizedEmail = email.trim().toLowerCase();
  //     console.log(`Searching for user with email: ${normalizedEmail} in tenant: ${tenantId}`); // Debugging
  
  //     // Find user by email and tenantId
  //     return await userRepository.findOne({ 
  //       where: { 
  //         email: normalizedEmail, 
  //         tenantId: tenantId 
  //       } 
  //     });
  //   } catch (error) {
  //     console.error('Error finding user by email and tenant:', error);
  //     throw new Error('Could not find user by email and tenant');
  //   }
  // }

  async findByEmailAndTenant(email: string, tenantId: string): Promise<User | null> {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      console.log(`Searching for user with email: ${normalizedEmail} in tenant: ${tenantId}`); // Debugging
  
      return await userRepository.findOne({
        where: {
          email: normalizedEmail,
          hotel: { tenantId },
        },
        relations: ['hotel'],
      });
    } catch (error) {
      console.error('Error finding user by email and tenant:', error);
      throw new Error('Could not find user by email and tenant');
    }
  }
  
  
  


  // static async findEmployeeId(employeeId: string): Promise<User | null> {
  //   try {
  //     return await userRepository.findOne({ where: { employeeId } });
  //   } catch (error) {
  //     console.error('Error finding user by employeeId:', error);
  //     throw new Error('Could not find user by employeeId');
  //   }
  // }

  static async findEmployeeId(employeeId: string) {
    return await userRepository.findOneBy({ employeeId });
  }


  async findByResetToken(resetPasswordToken: string): Promise<User | null> {
    try {
      return await userRepository.findOne({
        where: {
          resetPasswordToken,
          resetPasswordExpires: MoreThan(new Date()),
        },
      });
    } catch (error) {
      console.error('Error finding user by reset token:', error);
      throw new Error('Could not find user by reset token');
    }
  }

  static async generateTenantId(role: string): Promise<string> {
    const prefix = role === 'admin' ? 'adm' : 'emp';
    const uniqueId = uuidv4().slice(0, 8).toUpperCase(); // Unique part of the application number
    return `${prefix}-${uniqueId}`;
  }

  async generateAndSendTwoFactorToken(id: number, loginType: string): Promise<void> {
    try {
        const user = await userRepository.findOneBy({ id });

        if (!user) {
            throw new Error('User not found');
        }
        
        // Generate a 6-digit numeric token
        const twoFactorToken = Math.floor(100000 + Math.random() * 900000).toString()
        // const twoFactorToken = crypto.randomBytes(3).toString("hex");
        user.twoFactorToken = twoFactorToken;
        user.twoFactorExpires = new Date(Date.now() + 300000); // 5 minutes from now
        user.twoFactorEnabled = true;
        await this.updateData(user);

        if(loginType == "password-less"){
           await sendLoginLink({ email: user.email, firstName: user.firstName }, twoFactorToken);
        }else{
          await sendTwoFactorCodeEmail({ email: user.email, firstName: user.firstName }, twoFactorToken);
        }
    } catch (error) {
        console.error('Error generating or sending two-factor token:', error);
        throw new Error('Could not generate or send two-factor token');
    }
  }

  async verifyTwoFactorCode(email: string, twoFactorCode: string): Promise<string> {
    try {
        const hashedCode = crypto.createHash('sha256').update(twoFactorCode).digest('hex');

        const user = await userRepository.findOne({
            where: {
                email,
                twoFactorToken: hashedCode,
                twoFactorExpires: MoreThan(new Date())
            }
        });

        if (!user) {
            // Check if the token has expired or if the user doesn't exist
            const expiredUser = await userRepository.findOne({
                where: {
                    email,
                    twoFactorExpires: LessThan(new Date())
                }
            });

            if (expiredUser) {
                return 'The two-factor code has expired. Please request a new one.';
            }

            return 'Invalid email or two-factor code.';
        }

        // Clear the two-factor token and expiry date after successful verification
        user.twoFactorToken = null;
        user.twoFactorExpires = null;
        user.twoFactorEnabled = false;
        await this.updateData(user);

        return 'Two-factor verification successful.';
    } catch (error) {
        console.error('Error verifying two-factor code:', error);
        throw new Error('Error verifying two-factor code');
    }
  }

  async updateData(user: User): Promise<User> {
    try {
      return await userRepository.save(user);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Could not update user');
    }
  }

  async findUsersWithIncompleteOnboarding(): Promise<User[]> {
    return userRepository.createQueryBuilder('user')
        .where('user.onboardingStep < :step', { step: 12 })
        .andWhere('user.role = :role', { role: 'applicant' })
        .getMany();
  }

  async findUsersWithOnboardingInProgress(): Promise<User[]> {
    return userRepository.createQueryBuilder('user')
      .where('user.onboardingStep > :minStep', { minStep: 1 })
      .andWhere('user.onboardingStep < :maxStep', { maxStep: 11 })
      .andWhere('user.role = :role', { role: 'applicant' })
      .getMany();
  }

  async findAllAprrovedCandidates(): Promise<User[]> {
    return userRepository.createQueryBuilder('user')
      .where('user.accountStatus = :accountStatus', { accountStatus: 'Approved' })
      .getMany();
  }
  
}

