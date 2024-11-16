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
// Create a transporter using your email service configuration
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail", // use your email service
    auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password
    },
});
// Function to send an email
function sendEmail(to, subject, html, attachments) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
            attachments, // optional attachments, if provided
        };
        try {
            yield transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        }
        catch (error) {
            console.error("Error sending email:", error);
        }
    });
}
