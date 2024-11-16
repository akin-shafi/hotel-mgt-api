"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = resetPasswordEmail;
// resetPasswordEmail.js
const emailHeader_1 = require("./emailHeader");
const emailFooter_1 = require("./emailFooter");
const config_1 = require("../config");
function resetPasswordEmail(user, resetToken) {
    return `
                ${(0, emailHeader_1.emailHeader)('others')} 
                <div class="email-body" style="background-color: #ffffff; border-radius: 4px">
                    <h1 style="font-size: 24px; color: #333;">Password Reset Request</h1>
                    <p style="font-size: 16px; color: #333;">Hello ${user.firstName},</p>
                    <p style="font-size: 16px; color: #333;">
                        We received a request to reset your password. Click the link below to reset your password:
                    </p>
                    <a href="${config_1.FRONTEND_URL}/reset-password?token=${resetToken}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #211c1c; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p style="font-size: 16px; color: #333;">
                        If you did not request this, please ignore this email and your password will remain unchanged.
                    </p>
                    <p style="font-size: 16px; color: #333;">Best regards,</p>
                    <p style="font-size: 16px; color: #333;">The ${process.env.APP_COMPANY} Team</p>
                </div>
                ${(0, emailFooter_1.emailFooter)()}
           
    `;
}
