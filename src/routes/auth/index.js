import express from 'express';
import { createUser } from '../../controllers/auth';

const authRouter = express.Router();

authRouter.post('/auth/google-signup', createUser);

export default authRouter;
