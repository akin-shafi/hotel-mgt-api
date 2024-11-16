"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = twoFactorEmail;
const emailHeader_1 = require("./emailHeader");
const emailFooter_1 = require("./emailFooter");
// export default function generateTwoFactorEmailTemplate(user: { firstName?: string }, token: string) {
function twoFactorEmail(user, resetToken) {
    return `
            ${(0, emailHeader_1.emailHeader)('others')}
            <div style="padding: 20px;">
                <p>Hi ${user.firstName},</p>
                <p>Your Two-Factor Authentication (2FA) code is:</p>
                <h2 style="text-align: center;">${resetToken}</h2>
                <p>This code will expire in 5 minutes.</p>
                <p>Best regards,<br>Your Team</p>
            </div>
            ${(0, emailFooter_1.emailFooter)()}
`;
}
