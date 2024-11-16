"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkEmailTemplate = bulkEmailTemplate;
const emailHeader_1 = require("./emailHeader");
const emailFooter_1 = require("./emailFooter");
// Bulk Email Template
function bulkEmailTemplate(firstName, message) {
    return `
    ${(0, emailHeader_1.emailHeader)('others')}
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h3 style="color: #333;">Hello ${firstName}!</h3>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">${message}</p>
        <p style="font-size: 14px; color: #777;">
          If you have any questions or need further assistance, feel free to contact our support team.
        </p>
        <p style="font-size: 14px; color: #777;">
          Best regards,<br>The ${process.env.APP_COMPANY || 'Company'} Team
        </p>
      </div>
    ${(0, emailFooter_1.emailFooter)()}
  `;
}
