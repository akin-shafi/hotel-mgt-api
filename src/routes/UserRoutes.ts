import { Router } from 'express';
import UserController from '../controllers/UserController';
// import multer from '../multerConfig'; // Import multer configuration
import uploadDocumentsAndImages from '../multerConfig'; // Import multer configuration

const router = Router();

  /**
   * @swagger
   * /users/test-email:
   *   post:
   *     summary: Send a test email
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 default: "test@example.com"
   *                 description: Recipient email address
   *     responses:
   *       200:
   *         description: Email sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Success message
   *       500:
   *         description: Server error
   */
  router.post('/test-email', UserController.testEmail);


/**
 * @swagger
 * /users/submit-email:
 *   post:
 *     summary: Register user and send verification code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *               loginType:
 *                 type: string
 *                 description: Login type (e.g., setup, invite)
 *           example:
 *             firstName: John
 *             lastName: Doe
 *             email: john.doe@example.com
 *             password: Test@123
 *             loginType: setup
 *     responses:
 *       200:
 *         description: Verification code sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification code sent
 *       400:
 *         description: User email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User email is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: string
 */
router.post('/submit-email', UserController.registerAndSendVerificationCode);


  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: User login
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 default: "engineering@copora.com"
   *                 description: User email
   *               password:
   *                 type: string
   *                 default: "password"
   *                 format: password
   *                 description: User password
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: JWT token
   *       400:
   *         description: Invalid email or password
   *       500:
   *         description: Server error
   */
  router.post('/login', UserController.login);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               role:
 *                 type: string
 *                 enum: [front_desk, admin, manager, receptionist, guest]
 *                 example: front_desk
 *               accountStatus:
 *                 type: string
 *                 enum: [active, suspended, deactivated]
 *                 example: active
 *               isVerified:
 *                 type: boolean
 *                 default: false
 *               twoFactorEnabled:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       '201':
 *         description: User registered successfully. Please check your email to verify your account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully. Please check your email to verify your account.
 *       '400':
 *         description: Bad request. Missing fields or user already exists.
 */

router.post('/register', uploadDocumentsAndImages.single('profilePicture'), async (req, res) => {
  try {
    // Call UserController method for registration
    await UserController.register(req, res);
  } catch (error) {
    console.error('Error during registration:', error);
    // No response here; UserController handles it
  }
});


  /**
   * @swagger
   * /users/verify-email:
   *   get:
   *     summary: Verify user email
   *     description: Verify the user's email address using the verification token sent to the user's email.
   *     tags: [Authentication]
   *     parameters:
   *       - in: query
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: The verification token sent to the user's email.
   *     responses:
   *       '200':
   *         description: Email verified successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Email verified successfully
   *       '400':
   *         description: Invalid or expired verification token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid or expired verification token
   *       '500':
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Server error
   *                 error:
   *                   type: string
   *                   example: Error message details
   */
  router.get('/verify-email', UserController.verifyEmail);

  /**
   * @swagger
   * /users/forget-password:
   *   post:
   *     summary: Send password reset email
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *     responses:
   *       200:
   *         description: Password reset email sent
   *       400:
   *         description: Email is required
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  router.post('/forget-password', UserController.forgetPassword);

  /**
   * @swagger
   * /users/reset-password:
   *   post:
   *     summary: Reset user password
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *               newPassword:
   *                 type: string
   *                 example: newpassword123
   *     responses:
   *       200:
   *         description: Password reset successfully
   *       400:
   *         description: Token and new password are required
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  router.post('/reset-password', UserController.resetPassword);

  /**
   * @swagger
   * /users/toggle-two-factor:
   *   post:
   *     summary: Toggle two-factor authentication
   *     description: Enables or disables two-factor authentication for the user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       200:
   *         description: Two-factor authentication toggled
   *       400:
   *         description: Bad request
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  router.post('/toggle-two-factor', UserController.toggleTwoFactor);

  /**
   * @swagger
   * /users/send-two-factor-code:
   *   post:
   *     summary: Generate and send two-factor authentication token
   *     tags: [Authentication]
   *     description: Generates a 2FA token and sends it to the user via email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       200:
   *         description: Two-factor authentication token sent
   *       400:
   *         description: Bad request
   *       500:
   *         description: Server error
   */
  router.post('/send-two-factor-code', UserController.generateTwoFactorToken);
  
  /**
   * @swagger
   * /users/verify-two-factor:
   *   post:
   *     summary: Verify the two-factor authentication code
   *     description: This endpoint verifies the two-factor authentication code. You should pass the user email and the two-factor code received via email.
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: "user@example.com"
   *                 description: The email address of the user.
   *               twoFactorCode:
   *                 type: string
   *                 example: "123456"
   *                 description: The two-factor authentication code sent to the user's email.
   *     responses:
   *       200:
   *         description: Successfully verified two-factor authentication code and generated JWT token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   example: 200
   *                 token:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *                   description: The JWT token for authenticated user.
   *                 user:
   *                   type: object
   *                   properties:
   *                     userId:
   *                       type: integer
   *                       example: 1
   *                     role:
   *                       type: string
   *                       example: "applicant"
   *                     firstName:
   *                       type: string
   *                       example: "John"
   *                     middleName:
   *                       type: string
   *                       example: "Doe"
   *                     lastName:
   *                       type: string
   *                       example: "Doe"
   *                     email:
   *                       type: string
   *                       example: "user@example.com"
   *       400:
   *         description: Bad request due to missing parameters or invalid input.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: "User email and two-factor code are required"
   *       401:
   *         description: Unauthorized due to invalid two-factor authentication code.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   example: 401
   *                 message:
   *                   type: string
   *                   example: "Invalid two-factor authentication code"
   *       404:
   *         description: User not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: "User not found"
   *       500:
   *         description: Server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 statusCode:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: "Server error"
   *                 error:
   *                   type: string
   *                   example: "Error details"
   */
  router.post('/verify-two-factor', UserController.verifyTwoFactorCode);
  


export default router;

