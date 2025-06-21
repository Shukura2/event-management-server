import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendMail(messageDetails) {
  const {
    email, username, title, eventDate, venue
  } = messageDetails;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shukurahkike@gmail.com',
      pass: process.env.NODEMAILER_AUTH_PASS,
    },
  });

  await transporter.sendMail({
    from: 'Event MGT. <shukurahkike@gmail.com>',
    to: email,
    subject: 'Your Attendance is Confirmed! 🎉',
    html: `<h3>Dear <strong style={{text-transform:'capitalize'}}>${username}</strong>, </h3>
    <br />
    <p>Thank you for confirming your attendance! We’re excited to have you at ${title}.</p>
    <p>📍 Event Details:</p>
    <p>🗓 Date: ${eventDate}</p>
    <p>📍 Location: ${venue}</p>
    <p>Attached is your QR code for check-in. Please present it at the entrance for a smooth entry.</p>
    <p>See you soon!</p>`,
  });
}
