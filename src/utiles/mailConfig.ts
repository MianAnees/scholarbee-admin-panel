// emailService.js

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    const msg = {
        to,
        from: process.env.DEFAULT_FROM_EMAIL,
        subject,
        html,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('Error response:', error.response.body);
        }
    }
};

module.exports = sendEmail;
