import { emailHeader } from './emailHeader';
import { emailFooter } from './emailFooter';

export default function testEmailTemplate(user: { firstName?: string; email: string; }) {
  return `
    ${emailHeader('test')}
    <div style="padding: 10px; font-family: Arial, sans-serif; line-height: 1.5;">
      <h3 style="color: #333;">Hello, ${user.firstName ? user.firstName : 'User'}!</h3>
      <p style="color: #555;">
        This is a test email sent from ${process.env.APP_COMPANY}. We're just testing our email sending service to make sure everything is working correctly.
      </p>
      <p style="color: #555;">
        If you received this email, the test was successful!
      </p>
      <p style="color: #555;">
        If you have any feedback or need assistance, feel free to contact our support team.
      </p>
      <p style="color: #333;">Best regards,<br>The ${process.env.APP_COMPANY} Team</p>
    </div>
    ${emailFooter()}
  `;
}
