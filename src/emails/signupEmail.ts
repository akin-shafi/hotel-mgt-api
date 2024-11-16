import { emailHeader } from './emailHeader';
import { emailFooter } from './emailFooter';

export default function signupEmail(user: { firstName?: string; email: string; }) {
  return `
    ${emailHeader('others')}
      <div style="padding: 20px;">
        <h3>Welcome to ${process.env.APP_COMPANY}, ${user.firstName ? user.firstName : 'User'}!</h3>
        <p>Thank you for signing up. We're excited to have you on board!</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The ${process.env.APP_COMPANY} Team</p>
      </div>
      ${emailFooter()}
  `;
}
