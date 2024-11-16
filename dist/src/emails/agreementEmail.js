"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = agreementEmail;
const emailHeader_1 = require("./emailHeader");
const emailFooter_1 = require("./emailFooter");
function agreementEmail(user) {
    return `
    ${(0, emailHeader_1.emailHeader)('others')}
      <div style="padding: 20px;">
        <h3>Hello ${user.firstName},</h3>
        <p>Please find attached your employment agreement document.</p>
        <p>If you have any questions or need further assistance, feel free to reach out to us.</p>
        <p>Best regards,<br>The ${process.env.APP_COMPANY} Team</p>
      </div>
    ${(0, emailFooter_1.emailFooter)()}
  `;
}
