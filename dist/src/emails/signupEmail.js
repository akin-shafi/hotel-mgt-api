"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = signupEmail;
const emailHeader_1 = require("./emailHeader");
const emailFooter_1 = require("./emailFooter");
function signupEmail(user) {
    return `
    ${(0, emailHeader_1.emailHeader)('others')}
      <div style="padding: 20px;">
        <h3>Welcome to ${process.env.APP_COMPANY}, ${user.firstName ? user.firstName : 'User'}!</h3>
        <p>Thank you for signing up. We're excited to have you on board!</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The ${process.env.APP_COMPANY} Team</p>
      </div>
      ${(0, emailFooter_1.emailFooter)()}
  `;
}
