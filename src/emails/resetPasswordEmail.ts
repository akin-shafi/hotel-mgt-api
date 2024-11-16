// resetPasswordEmail.js
import { emailHeader } from './emailHeader';
import { emailFooter } from './emailFooter';
import { FRONTEND_URL } from '../config';

export default function resetPasswordEmail(user: { firstName?: string; email: string; }, resetToken: string) {
    return `
                ${emailHeader('others')} 
                <div class="email-body" style="background-color: #ffffff; border-radius: 4px">
                    <h1 style="font-size: 24px; color: #333;">Password Reset Request</h1>
                    <p style="font-size: 16px; color: #333;">Hello ${user.firstName},</p>
                    <p style="font-size: 16px; color: #333;">
                        We received a request to reset your password. Click the link below to reset your password:
                    </p>
                    <a href="${FRONTEND_URL}/reset-password?token=${resetToken}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #211c1c; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p style="font-size: 16px; color: #333;">
                        If you did not request this, please ignore this email and your password will remain unchanged.
                    </p>
                    <p style="font-size: 16px; color: #333;">Best regards,</p>
                    <p style="font-size: 16px; color: #333;">The ${process.env.APP_COMPANY} Team</p>
                </div>
                ${emailFooter()}
           
    `;
}
