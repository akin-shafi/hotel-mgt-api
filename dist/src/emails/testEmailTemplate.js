"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = testEmailTemplate;
const emailHeader_1 = require("./emailHeader");
const emailFooter_1 = require("./emailFooter");
function testEmailTemplate(user) {
    return `
    ${(0, emailHeader_1.emailHeader)('test')}
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
    ${(0, emailFooter_1.emailFooter)()}
  `;
}
