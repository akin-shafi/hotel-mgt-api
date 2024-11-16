// main.ts
import testEmailTemplate from "../emails/testEmailTemplate";
import signupEmail from "../emails/signupEmail";

import resetPasswordEmail from "../emails/resetPasswordEmail";
import twoFactorEmail from "../emails/twoFactorEmail";
import loginLinkEmail from "../emails/loginLinkEmail";
import verificationEmail from "../emails/verificationEmail";
import invitationToOnboardEmail from '../emails/invitationToOnboardEmail';
import onboardingReminderEmail from '../emails/onboardingReminderEmail';
import onboardingCompletionEmail from '../emails/onboardingCompletionEmail';
import onboardingHospitalityWorkerEmail from '../emails/onboardingHospitalityWorkerEmail';
import { bulkEmailTemplate } from '../emails/bulkEmailTemplate';
import fs from 'fs';
import agreementEmail from '../emails/agreementEmail';  // Import the email template function

import { sendEmail } from "./email";

export async function sendTestEmail(email: string) {
  try {
    // Define the subject and the user details for the email
    const subject = "Welcome to Our App!";
    const user = { firstName: "Andrew", email };
    const html = testEmailTemplate(user);
    await sendEmail(email, subject, html);
  } catch (error) {
    console.error('Error sending test email:', error);
    throw new Error('Failed to send test email');
  }
}
// Function to send signup email
export async function sendSignupEmail(user: { firstName?: string; email: string; }) {
    const subject = "Welcome to Our App!";
    const html = signupEmail(user);
    await sendEmail(user.email, subject, html);
}

// Function to send verification email
export async function sendInvitationToOnboard(user: { firstName?: string; email: string; loginLink: string; temporaryPassword: string; }) {
    const subject = "Invitation to Onboard";
    const html = invitationToOnboardEmail(user);
    await sendEmail(user.email, subject, html);
}

// Function to send verification email
export async function sendVerificationEmail(user: { firstName?: string; email: string; temporaryPassword: string; }, verificationToken: string,) {
    const subject = "Verify Your Email Address";
    const html = verificationEmail(user, verificationToken);
    await sendEmail(user.email, subject, html);
}

// Function to send password reset email

export async function sendResetPasswordEmail(user: { email: string; firstName: string; }, resetToken: string) {
    const subject = "Password Reset Request";
    const html = resetPasswordEmail(user, resetToken);
    await sendEmail(user.email, subject, html);
}

// Function to send two-factor verification email
// { email: user.email, firstName: user.firstName }, twoFactorToken
export async function sendTwoFactorCodeEmail(user: { firstName?: string; email: string; }, resetToken: any) {
    const subject = "Your Two-Factor Authentication Code";
    const html = twoFactorEmail(user, resetToken);
    await sendEmail(user.email, subject, html);
}
// sendLoginLink({ email: user.email, firstName: user.firstName, verificationLink });
export async function sendLoginLink(user: { firstName?: string; email: string; }, twoFactorToken: any) {
    const subject = "Your Login Link";
    const html = loginLinkEmail(user, twoFactorToken);
    await sendEmail(user.email, subject, html);
}

// Function to send onboarding reminder email
export async function sendOnboardingReminderEmail(user: { firstName: string; email: string, loginLink: string; }) {
    const subject = 'Complete Your Onboarding with Copora';
    const html = onboardingReminderEmail(user);  // Generate the email HTML
    await sendEmail(user.email, subject, html);  // Send the email
}

export async function sendOnboardingCompletionEmail(user: { firstName: string; email: string }) {
    const subject = 'Onboarding Completed';
    const html = onboardingCompletionEmail(user);  // Generate the email HTML
    await sendEmail(user.email, subject, html);  // Send the email
}

export async function sendOnboardingHospitalityWorkerEmail(user: { firstName: string; email: string }) {
    const subject = 'Welcome ';
    const html = onboardingHospitalityWorkerEmail(user);  // Generate the email HTML
    await sendEmail(user.email, subject, html);  // Send the email
}


// Function to send bulk onboarding completion emails
export async function sendBulkOnboardingCompletionEmails(
  recipients: { email: string; firstName: string }[],
  customSubject: string,
  customContent: string
): Promise<void> {
  for (const recipient of recipients) {
    if (!recipient.email) {
      console.error(`Error: No email defined for recipient: ${JSON.stringify(recipient)}`);
      continue; // Skip if email is missing
    }

    try {
      const html = bulkEmailTemplate(recipient.firstName, customContent); // Generate the email content with the recipient's name
      console.log(`Sending email to ${recipient.email} (${recipient.firstName})`); // Log the email and name being sent

      await sendEmail(recipient.email, customSubject, html); // Send the email

      console.log(`Email sent to ${recipient.email} (${recipient.firstName}) successfully`);
    } catch (error) {
      console.error(`Error sending email to ${recipient.email} (${recipient.firstName}):`, error);
    }
  }
}

// Function to send emails in batches
export async function sendEmailsInBatches(
  recipients: { email: string; firstName: string }[],
  customSubject: string,
  customContent: string,
  batchSize: number = 50
): Promise<void> {
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    try {
      await Promise.all(
        batch.map((recipient) => 
          sendBulkOnboardingCompletionEmails([recipient], customSubject, customContent))
      );
      console.log(`Batch ${i / batchSize + 1} processed successfully`);

      // Delay between batches to prevent overwhelming the SMTP server
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
    } catch (error) {
      console.error(`Error processing batch ${i / batchSize + 1}:`, error);
    }
  }
}



  export async function sendAgreementEmail(user: { firstName: string; email: string }, pdfPath: string) {
    const subject = 'Your Employment Agreement';
    const html = agreementEmail(user);  // Generate the email HTML
    const attachments = [
      {
        filename: 'agreement.pdf',
        content: fs.createReadStream(pdfPath),
      },
    ];
    await sendEmail(user.email, subject, html, attachments); 
  }
  




