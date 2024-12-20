// loginLinkEmail.js
import { emailHeader } from './emailHeader';
import { emailFooter } from './emailFooter';
import { FRONTEND_LOGIN } from '../config';

export default function loginLinkEmail(user: { firstName?: string; email: string; }, twoFactorToken: any) {
    const verificationUrl = `${FRONTEND_LOGIN}/login-without-code?email=${encodeURIComponent(user.email)}&code=${encodeURIComponent(twoFactorToken)}`;

    return `
        ${emailHeader('others')}
            <div class="email-body" style="background-color: #ffffff; border-radius: 4px">
                <p style="">
                Hi ${user.firstName || 'User'},
                </p>
                <p style="">
                You can log in without a password using the button below:
                </p>

                <p style="">
                <a href="${verificationUrl}" 
                    style="text-decoration: none; cursor:pointer; 
                    background-color:#247A84; color:#fff; 
                    padding:0.5rem 1rem; border:0; outline:0; 
                    border-radius:100px; font-weight:600">Log In</a>
                </p>
                
                
                <p style="">
                or Copy and Paste the 2FA Code into the input:
                </p>
                <h2 style="
                    font-family: Inter;
                    text-align: center;
                    font-size: 24px;
                    color: #000000;
                ">
                ${twoFactorToken}
                </h2>
                <p style="">
                This code will expire in 5 minutes.
                </p>
                <p style="">
                If you did not request this, please ignore this email.
                </p>
                <p style="">
                Best regards,<br>The ${process.env.APP_COMPANY} Team
                </p>
            </div>

        ${emailFooter()}
  `;
}
