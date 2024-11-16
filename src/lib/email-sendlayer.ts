import nodemailer from "nodemailer";

// Create a transporter using SendLayer's SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SENDLAYER_HOST,   // e.g., smtp.sendlayer.com
  port: 587,                          // Port for secure email (usually 587 or 465)
  secure: false,                      // Set to true if using port 465
  auth: {
    user: process.env.SENDLAYER_USER, // SMTP username provided by SendLayer
    pass: process.env.SENDLAYER_PASS, // SMTP password provided by SendLayer
  },
});

// Function to send an email with optional attachments
export async function sendEmail(
  to: string | string[], 
  subject: string, 
  html: string, 
  attachments?: any[]
) {
  const mailOptions = {
    from: "info@copora.com",
    to,          // recipient(s)
    subject,     // email subject
    html,        // email body in HTML
    attachments, // optional attachments, if provided
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} successfully`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
