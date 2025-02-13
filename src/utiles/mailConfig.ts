import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.RESEND_API_KEY, "==== in env");

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
    try {
        const response = await resend.emails.send({
            from: 'no-reply@scholarbee.pk', // Update with your verified sender email
            to,
            subject,
            html
        });

        console.log('Email sent:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
