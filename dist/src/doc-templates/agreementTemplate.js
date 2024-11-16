"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agreementTemplate = void 0;
const agreementTemplate = (data) => `
    <html>
      <body>
        <h1>Employment Agreement</h1>
        <p>This Employment Agreement is made between:</p>
        <p><strong>Copora Limited</strong> and <strong>${data.firstName} ${data.middleName || ''} ${data.lastName}</strong></p>
        <p>Resident Address: ${data.address}</p>
        <p>Email: ${data.email}</p>
        <h2>Job Title</h2>
        <p>${data.jobTitle}</p>
        <p>...</p>
        <p>Employee Signature: _______________</p>
      </body>
    </html>
  `;
exports.agreementTemplate = agreementTemplate;
