// resetPasswordEmail.js
import { emailHeader } from './emailHeader';
import { emailFooter } from './emailFooter';
// import { FRONTEND_URL } from '../config';


export default function onboardingHospitalityWorkerEmail(user: { firstName?: string; email: string; }) {
    return `
         
        ${emailHeader('welcome')}
            <div style="padding: 20px;">
                <p>
                    Hi ${user.firstName},
                </p>
                <p>
                    Thank you for your interest in joining the Copora team! We’re excited about the opportunity to welcome you into our community.
                </p>
                <p>
                    At Copora, we connect talented individuals with temporary roles at some of the UK’s most prestigious events, including the Royal Chelsea Flower Show, Goodwood, Glastonbury, Isle of Wight Festival, and many more. Whether you’re just beginning your career or bringing valuable experience, we’re here to help you find opportunities that match your skills and ambitions.
                </p>
                <p>
                    We understand that everyone’s career path is unique. If you’re starting out, we’ll provide the training and tools you need to excel. For those with more experience, we offer the opportunities and support to help you advance further.
                </p>
                <p>
                    While hospitality is a significant part of what we do, Copora also partners with some of the world’s leading companies in IT, telecommunications, and technology to recruit for permanent positions. We also offer dedicated programmes to help students secure their first full-time jobs. To explore the full range of opportunities available, please feel free to visit our website.
                </p>
                <br>
                <p>
                    <a href="" style="text-decoration: none; cursor:pointer; background-color:#247A84; color:#fff; padding:0.5rem 1rem; border:0; outline:0; border-radius:5px; font-weight:600">Start onboarding</a>
                </p>
                <br>
                <p>
                    The next step is to set you up on our internal system. Once you’ve provided the necessary information, we’ll share the available roles in your area and get you started as soon as possible.
                </p>
                <p>
                    We’re genuinely looking forward to having you as part of the Copora community. If you have any questions or need assistance with the onboarding process, please don’t hesitate to reach out.
                </p>
                <p>
                    Best regards, <br><br>
                    <strong>The ${process.env.APP_COMPANY} Team</strong>
                </p>
            </div>
        ${emailFooter()}
            
     
    `;
}

