import express from 'express';
import { createUser, requestAdminAccess } from '../../controllers/auth';
import { isLoggedIn } from '../../middlewares';

const authRouter = express.Router();

authRouter.post('/auth/google-signup', createUser);
authRouter.post('/request-admin-access', isLoggedIn, requestAdminAccess);

export default authRouter;
