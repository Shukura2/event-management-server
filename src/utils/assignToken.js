import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { SECRET_KEY } = process.env;

const assignToken = (userInfo) => jwt.sign({ userInfo }, SECRET_KEY, { expiresIn: '10h' });

export default assignToken;
