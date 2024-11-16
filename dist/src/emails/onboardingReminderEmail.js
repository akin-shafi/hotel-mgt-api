"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = onboardingReminderEmail;
// resetPasswordEmail.js
const emailHeader_1 = require("./emailHeader");
const emailFooter_1 = require("./emailFooter");
// import { FRONTEND_URL } from '../config';
function onboardingReminderEmail(user) {
    return `
    ${(0, emailHeader_1.emailHeader)('remainder')}
        <p>Hi ${user.firstName},</p>
        
        <p>We noticed that your onboarding process with Copora is still incomplete. If you’re having any trouble providing the necessary information or if you’re unsure about any of the steps, please don’t hesitate to get in touch. We’re here to assist you and make the process as smooth as possible.</p>
        
        <p>Completing your onboarding is essential for accessing our booking system and viewing available roles, so please reach out if you need any help.</p>
        
        <p>If you have not started the process yet, please log in using the link below:</p>
        
        <p>
            <a href="${user.loginLink}" style="text-decoration: none; color: #247A84;">${user.loginLink}</a>
        </p>
        
        <p>If you do not remember your password, simply click on "Forgot Password" and follow the instructions to reset it.</p>
        
        <p>Best regards,<br/>
        The ${process.env.APP_COMPANY} Team</p>
    
    ${(0, emailFooter_1.emailFooter)()}
    
    `;
}
