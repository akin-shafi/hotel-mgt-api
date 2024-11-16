import cron from 'node-cron';
import { UserService } from '../services/UserService';
import { sendOnboardingReminderEmail } from '../lib/emailActions';
import { FRONTEND_LOGIN } from '../config';

// Initialize UserService
const userService = new UserService();

// Schedule the task to run at 11 PM daily
// cron.schedule('0 23 * * *', async () => { 
cron.schedule('*/5 * * * * *', async () => { // 5 secs
// cron.schedule('0 */11 * * *', async () => {
    try {
        // Query users with onboardingStep less than 5 and role is applicant
        const users = await userService.findUsersWithIncompleteOnboarding();

        if (users.length > 0) {
            console.log(`Found ${users.length} users with incomplete onboarding`);

            // Send reminder emails
            for (const user of users) {
                const emailData = {
                    firstName: user.firstName,
                    email: user.email,
                    loginLink: `${FRONTEND_LOGIN}`,
                };
                await sendOnboardingReminderEmail(emailData);
            }

            console.log('Reminder emails sent successfully.');
        } else {
            console.log('No users found with incomplete onboarding.');
        }
    } catch (error) {
        console.error('Error running the onboarding reminder script:', error);
    }
});

