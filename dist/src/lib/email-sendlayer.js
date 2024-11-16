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
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create a transporter using SendLayer's SMTP configuration
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SENDLAYER_HOST, // e.g., smtp.sendlayer.com
    port: 587, // Port for secure email (usually 587 or 465)
    secure: false, // Set to true if using port 465
    auth: {
        user: process.env.SENDLAYER_USER, // SMTP username provided by SendLayer
        pass: process.env.SENDLAYER_PASS, // SMTP password provided by SendLayer
    },
});
// Function to send an email with optional attachments
function sendEmail(to, subject, html, attachments) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: "info@copora.com",
            to, // recipient(s)
            subject, // email subject
            html, // email body in HTML
            attachments, // optional attachments, if provided
        };
        try {
            yield transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to} successfully`);
        }
        catch (error) {
            console.error("Error sending email:", error);
        }
    });
}
