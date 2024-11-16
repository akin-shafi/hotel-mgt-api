"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = onboardingCompletionEmail;
// resetPasswordEmail.js
const emailHeader_1 = require("./emailHeader");
const emailFooter_1 = require("./emailFooter");
// import { FRONTEND_URL } from '../config';
function onboardingCompletionEmail(user) {
    return `
        
    ${(0, emailHeader_1.emailHeader)('complete_email')}
        <div style="padding: 20px;">
            <p>Hi ${user.firstName},</p>
            <p>Thank you for completing the onboarding process with Copora. We’re excited to have you on board!</p>
            <p>Please note that while our booking system is still in development, we’ll keep you updated and let you know as soon as it’s available for accessing and viewing roles.</p>
            <p>In the meantime, if you have any questions or need further assistance, feel free to reach out to our recruitment team.</p>
            <p>Best regards,</p>
            <p>The ${process.env.APP_COMPANY} Team</p>
        </div>
    ${(0, emailFooter_1.emailFooter)()}

            
    `;
}
