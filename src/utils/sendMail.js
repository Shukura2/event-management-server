import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import fs from 'fs';
import assignToken from './assignToken';

export async function sendMail(messageDetails) {
  const { email, username, title, eventDate, venue, eventId, userDetailsId } =
    messageDetails;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: 'shukurahkike@gmail.com', pass: 'bibj nzqx gjct yham' },
  });

  const token = assignToken({ userDetailsId, eventId });
  const textToEncode = token;

  const qrCodeFilePath = './qrcode.png';
  await QRCode.toFile(qrCodeFilePath, textToEncode);

  const info = await transporter.sendMail({
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
    text: 'Please find your QR Code attached.',
    attachments: [
      { filename: 'qrcode.png', path: qrCodeFilePath, cid: 'qrcode' },
    ],
  });
  fs.unlinkSync(qrCodeFilePath);
}
