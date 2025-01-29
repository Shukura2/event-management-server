import QRCode from 'qrcode';

const data = 'Hello world!';
const filePath = 'qr-code.png';

QRCode.toFile(
  filePath,
  data,
  {
    errorCorrectionLevel: 'H',
    margin: 2,
    scale: 4,
  },
  (err) => {
    if (err) {
      console.error('Error generating qr code', err);
    } else {
      console.log('qr code generated successfully');
    }
  }
);
