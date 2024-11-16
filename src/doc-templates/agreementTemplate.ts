export const agreementTemplate = (data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    address: string;
    jobTitle: string;
  }) => `
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
  