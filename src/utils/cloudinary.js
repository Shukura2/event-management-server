import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import DataURIParser from 'datauri/parser';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dUri = new DataURIParser();

// eslint-disable-next-line max-len
export const dataUri = (req) => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

export const uploadToCloud = async (file) => {
  const { secure_url: secureUrl } = await cloudinary.uploader.upload(file, {
    folder: 'Event Images',
  });
  return secureUrl;
};

export default cloudinary;
