import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.SES_SMTP_USERNAME,
    process.env.SES_SMTP_PASSWORD, "==== in env")

export const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    secure: false,  // True for 465, false for other ports
    auth: {
        user: process.env.SES_SMTP_USERNAME,
        pass: process.env.SES_SMTP_PASSWORD
    }
});