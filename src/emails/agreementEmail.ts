import { emailHeader } from './emailHeader';
import { emailFooter } from './emailFooter';

export default function agreementEmail(user: { firstName: string }) {
  return `
    ${emailHeader('others')}
      <div style="padding: 20px;">
        <h3>Hello ${user.firstName},</h3>
        <p>Please find attached your employment agreement document.</p>
        <p>If you have any questions or need further assistance, feel free to reach out to us.</p>
        <p>Best regards,<br>The ${process.env.APP_COMPANY} Team</p>
      </div>
    ${emailFooter()}
  `;
}
