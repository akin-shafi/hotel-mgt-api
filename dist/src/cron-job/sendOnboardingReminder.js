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
const node_cron_1 = __importDefault(require("node-cron"));
const UserService_1 = require("../services/UserService");
const emailActions_1 = require("../lib/emailActions");
const config_1 = require("../config");
// Initialize UserService
const userService = new UserService_1.UserService();
// Schedule the task to run at 11 PM daily
// cron.schedule('0 23 * * *', async () => { 
node_cron_1.default.schedule('*/5 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    // cron.schedule('0 */11 * * *', async () => {
    try {
        // Query users with onboardingStep less than 5 and role is applicant
        const users = yield userService.findUsersWithIncompleteOnboarding();
        if (users.length > 0) {
            console.log(`Found ${users.length} users with incomplete onboarding`);
            // Send reminder emails
            for (const user of users) {
                const emailData = {
                    firstName: user.firstName,
                    email: user.email,
                    loginLink: `${config_1.FRONTEND_LOGIN}`,
                };
                yield (0, emailActions_1.sendOnboardingReminderEmail)(emailData);
            }
            console.log('Reminder emails sent successfully.');
        }
        else {
            console.log('No users found with incomplete onboarding.');
        }
    }
    catch (error) {
        console.error('Error running the onboarding reminder script:', error);
    }
}));
