import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendFeedbackMail(email, content, eventTitle) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'shukurahkike@gmail.com',
      pass: process.env.NODEMAILER_AUTH_PASS,
    },
  });

  await transporter.sendMail({
    from: 'Event MGT. <shukurahkike@gmail.com>',
    to: email,
    subject: eventTitle,
    html: content,
  });
}
