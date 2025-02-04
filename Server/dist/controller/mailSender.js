import nodemailer from "nodemailer";
import { config } from "dotenv";
config();
export const mailSender = (email, title, body) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        transporter.sendMail({
            from: "Quiz App || CIARO TEAMS",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        }, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return reject(error);
            }
            resolve(info);
        });
    });
};
