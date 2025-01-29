const nodemailer = require('nodemailer');

const html = `
<h1>hello world</h1>
<p>Isn't nodemailer useful?</p>
`;

export async function sendMail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: 'shukurahkike@gmail.com',
      pass: 'NodeMailer123!',
    },
  });

  const info = await transporter.sendMail({
    from: 'ShukuBaby <shukurahkike@gmail.com>',
    to: 'shukkike@gmail.com',
    subject: 'Testing Testing Testing',
    html: html,
  });

  console.log('message sent', info);
}
