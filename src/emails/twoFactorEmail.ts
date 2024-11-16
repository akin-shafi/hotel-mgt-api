import { emailHeader } from './emailHeader';
import { emailFooter } from './emailFooter';

// export default function generateTwoFactorEmailTemplate(user: { firstName?: string }, token: string) {
export default function twoFactorEmail(user: { firstName?: string; email: string; }, resetToken: any) {
	return `
            ${emailHeader('others')}
            <div style="padding: 20px;">
                <p>Hi ${user.firstName},</p>
                <p>Your Two-Factor Authentication (2FA) code is:</p>
                <h2 style="text-align: center;">${resetToken}</h2>
                <p>This code will expire in 5 minutes.</p>
                <p>Best regards,<br>Your Team</p>
            </div>
            ${emailFooter()}
`;
}
