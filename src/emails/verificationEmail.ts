import { emailHeader } from './emailHeader';
import { emailFooter } from './emailFooter';
import { FRONTEND_URL } from '../config';
// emails/verificationEmail.ts
export default function verificationEmail(user: { firstName?: string; email: string; temporaryPassword: string; }, verificationToken: string): string {

  // const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
  const loginUrl = `${FRONTEND_URL}`;
  return `
        ${emailHeader('others')}
        

        <div>
          <h2 style="text-align: center;">Welcome to ${process.env.APP_COMPANY}</h2>
          <p>Hello ${user.firstName || 'User'},</p>
          <p>An admin account has been created for you at ${process.env.APP_COMPANY} using <strong>${user.email}</strong>.</p>
          <p>Your temporary password is: <strong>${user.temporaryPassword}</strong></p>
          <p>Please use this password to log in for the first time. We recommend changing it upon signing in to ensure your account security.</p>
          
          <a href="${loginUrl}" style="display: inline-block; background-color: #211c1c; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sign in to your account</a>
          
          <h3>Need help?</h3>
          <p>If you have any questions or need assistance with your account, feel free to contact our support team.</p>
          
          <p>Don’t see a button above? <a href="${loginUrl}" style="color: #211c1c; text-decoration: none;">Click here to sign in</a></p>
        </div>

        ${emailFooter()}
  `;
}

