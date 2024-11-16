"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTestEmail = sendTestEmail;
exports.sendSignupEmail = sendSignupEmail;
exports.sendInvitationToOnboard = sendInvitationToOnboard;
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendResetPasswordEmail = sendResetPasswordEmail;
exports.sendTwoFactorCodeEmail = sendTwoFactorCodeEmail;
exports.sendLoginLink = sendLoginLink;
exports.sendOnboardingReminderEmail = sendOnboardingReminderEmail;
exports.sendOnboardingCompletionEmail = sendOnboardingCompletionEmail;
exports.sendOnboardingHospitalityWorkerEmail = sendOnboardingHospitalityWorkerEmail;
exports.sendBulkOnboardingCompletionEmails = sendBulkOnboardingCompletionEmails;
exports.sendEmailsInBatches = sendEmailsInBatches;
exports.sendAgreementEmail = sendAgreementEmail;
// main.ts
const testEmailTemplate_1 = __importDefault(require("../emails/testEmailTemplate"));
const signupEmail_1 = __importDefault(require("../emails/signupEmail"));
const resetPasswordEmail_1 = __importDefault(require("../emails/resetPasswordEmail"));
const twoFactorEmail_1 = __importDefault(require("../emails/twoFactorEmail"));
const loginLinkEmail_1 = __importDefault(require("../emails/loginLinkEmail"));
const verificationEmail_1 = __importDefault(require("../emails/verificationEmail"));
const invitationToOnboardEmail_1 = __importDefault(require("../emails/invitationToOnboardEmail"));
const onboardingReminderEmail_1 = __importDefault(require("../emails/onboardingReminderEmail"));
const onboardingCompletionEmail_1 = __importDefault(require("../emails/onboardingCompletionEmail"));
const onboardingHospitalityWorkerEmail_1 = __importDefault(require("../emails/onboardingHospitalityWorkerEmail"));
const bulkEmailTemplate_1 = require("../emails/bulkEmailTemplate");
const fs_1 = __importDefault(require("fs"));
const agreementEmail_1 = __importDefault(require("../emails/agreementEmail")); // Import the email template function
const email_1 = require("./email");
function sendTestEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Define the subject and the user details for the email
            const subject = "Welcome to Our App!";
            const user = { firstName: "Andrew", email };
            const html = (0, testEmailTemplate_1.default)(user);
            yield (0, email_1.sendEmail)(email, subject, html);
        }
        catch (error) {
            console.error('Error sending test email:', error);
            throw new Error('Failed to send test email');
        }
    });
}
// Function to send signup email
function sendSignupEmail(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = "Welcome to Our App!";
        const html = (0, signupEmail_1.default)(user);
        yield (0, email_1.sendEmail)(user.email, subject, html);
    });
}
// Function to send verification email
function sendInvitationToOnboard(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = "Invitation to Onboard";
        const html = (0, invitationToOnboardEmail_1.default)(user);
        yield (0, email_1.sendEmail)(user.email, subject, html);
    });
}
// Function to send verification email
function sendVerificationEmail(user, verificationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = "Verify Your Email Address";
        const html = (0, verificationEmail_1.default)(user, verificationToken);
        yield (0, email_1.sendEmail)(user.email, subject, html);
    });
}
// Function to send password reset email
function sendResetPasswordEmail(user, resetToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = "Password Reset Request";
        const html = (0, resetPasswordEmail_1.default)(user, resetToken);
        yield (0, email_1.sendEmail)(user.email, subject, html);
    });
}
// Function to send two-factor verification email
// { email: user.email, firstName: user.firstName }, twoFactorToken
function sendTwoFactorCodeEmail(user, resetToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = "Your Two-Factor Authentication Code";
        const html = (0, twoFactorEmail_1.default)(user, resetToken);
        yield (0, email_1.sendEmail)(user.email, subject, html);
    });
}
// sendLoginLink({ email: user.email, firstName: user.firstName, verificationLink });
function sendLoginLink(user, twoFactorToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = "Your Login Link";
        const html = (0, loginLinkEmail_1.default)(user, twoFactorToken);
        yield (0, email_1.sendEmail)(user.email, subject, html);
    });
}
// Function to send onboarding reminder email
function sendOnboardingReminderEmail(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = 'Complete Your Onboarding with Copora';
        const html = (0, onboardingReminderEmail_1.default)(user); // Generate the email HTML
        yield (0, email_1.sendEmail)(user.email, subject, html); // Send the email
    });
}
function sendOnboardingCompletionEmail(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = 'Onboarding Completed';
        const html = (0, onboardingCompletionEmail_1.default)(user); // Generate the email HTML
        yield (0, email_1.sendEmail)(user.email, subject, html); // Send the email
    });
}
function sendOnboardingHospitalityWorkerEmail(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = 'Welcome ';
        const html = (0, onboardingHospitalityWorkerEmail_1.default)(user); // Generate the email HTML
        yield (0, email_1.sendEmail)(user.email, subject, html); // Send the email
    });
}
// Function to send bulk onboarding completion emails
function sendBulkOnboardingCompletionEmails(recipients, customSubject, customContent) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const recipient of recipients) {
            if (!recipient.email) {
                console.error(`Error: No email defined for recipient: ${JSON.stringify(recipient)}`);
                continue; // Skip if email is missing
            }
            try {
                const html = (0, bulkEmailTemplate_1.bulkEmailTemplate)(recipient.firstName, customContent); // Generate the email content with the recipient's name
                console.log(`Sending email to ${recipient.email} (${recipient.firstName})`); // Log the email and name being sent
                yield (0, email_1.sendEmail)(recipient.email, customSubject, html); // Send the email
                console.log(`Email sent to ${recipient.email} (${recipient.firstName}) successfully`);
            }
            catch (error) {
                console.error(`Error sending email to ${recipient.email} (${recipient.firstName}):`, error);
            }
        }
    });
}
// Function to send emails in batches
function sendEmailsInBatches(recipients_1, customSubject_1, customContent_1) {
    return __awaiter(this, arguments, void 0, function* (recipients, customSubject, customContent, batchSize = 50) {
        for (let i = 0; i < recipients.length; i += batchSize) {
            const batch = recipients.slice(i, i + batchSize);
            try {
                yield Promise.all(batch.map((recipient) => sendBulkOnboardingCompletionEmails([recipient], customSubject, customContent)));
                console.log(`Batch ${i / batchSize + 1} processed successfully`);
                // Delay between batches to prevent overwhelming the SMTP server
                yield new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
            }
            catch (error) {
                console.error(`Error processing batch ${i / batchSize + 1}:`, error);
            }
        }
    });
}
function sendAgreementEmail(user, pdfPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const subject = 'Your Employment Agreement';
        const html = (0, agreementEmail_1.default)(user); // Generate the email HTML
        const attachments = [
            {
                filename: 'agreement.pdf',
                content: fs_1.default.createReadStream(pdfPath),
            },
        ];
        yield (0, email_1.sendEmail)(user.email, subject, html, attachments);
    });
}
