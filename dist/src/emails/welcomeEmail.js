"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = welcomeEmail;
// resetPasswordEmail.js
const emailHeader_1 = require("./emailHeader");
const emailFooter_1 = require("./emailFooter");
const config_1 = require("../config");
function welcomeEmail(user) {
    return `
        ${(0, emailHeader_1.emailHeader)('remainder')} 
        <div class="email-body" style="background-color: #ffffff; border-radius: 4px">
            <p style="
                font-family: Inter;
                color: #000000;
                font-size: 14px;
                line-height: 20px;
                font-weight: normal;
                margin: 0;
                padding: 1rem;
                margin-bottom: -15px;">
                Hi ${user.firstName},
            </p>
            <p style="
                font-family: Inter;
                color: #000000;
                font-size: 14px;
                line-height: 20px;
                font-weight: normal;
                margin: 0;
                padding: 1rem;
                margin-bottom: -15px;">
                Thank you for completing the onboarding process with Copora. We’re pleased to have you moving forward with us.
            </p>
            <p style="
                font-family: Inter;
                color: #000000;
                font-size: 14px;
                line-height: 20px;
                font-weight: normal;
                margin: 0;
                padding: 1rem;
                margin-bottom: -15px;">
                Your documents are now with our Contracts Team for review. Once they’ve approved the information, we’ll activate your access to our booking system.
            </p>
            <p style="
                font-family: Inter;
                color: #000000;
                font-size: 14px;
                line-height: 20px;
                font-weight: normal;
                margin: 0;
                padding: 1rem;
                margin-bottom: -15px;">
                This will allow you to see all the available roles and start selecting the ones that best fit your schedule.
            </p>
            <p style="
                font-family: Inter;
                color: #000000;
                font-size: 14px;
                line-height: 20px;
                font-weight: normal;
                margin: 0;
                padding: 1rem;
                margin-bottom: -15px;">
                We look forward to working with you.
            </p>
            <p style="
                font-family: Inter;
                color: #000000;
                font-size: 14px;
                line-height: 20px;
                font-weight: normal;
                margin: 0;
                padding: 1rem;
                margin-bottom: -15px;">
                If you have any questions or need further assistance, please don’t hesitate to reach out.
            </p>
            <br>
            <p style="
                font-family: Inter;
                color: #000000;
                font-size: 14px;
                line-height: 20px;
                font-weight: normal;
                margin: 0;
                padding: 1rem;
                margin-bottom: -15px;">
                <a href="${config_1.FRONTEND_LOGIN}/auth/login" style="text-decoration: none; cursor:pointer; background-color:#247A84; color:#fff; padding:0.5rem 1rem; border:0; outline:0; border-radius:100px; font-weight:600">
                    Proceed to Dashboard
                </a>
            </p>
            <br>
            <p style="
                font-family: Inter;
                color: #000000;
                font-size: 14px;
                line-height: 20px;
                font-weight: normal;
                margin: 0;
                padding: 1rem;
                margin-bottom: -15px;">
                Best regards, <br><br>
                <strong>The ${process.env.APP_COMPANY} Team</strong>
            </p>
        </div>
        ${(0, emailFooter_1.emailFooter)()}
    `;
}
