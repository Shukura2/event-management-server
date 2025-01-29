import express from 'express';
import passport from 'passport';
import { createUser, logoutUser } from '../../controllers/auth';
import { validateExistingUser, validateSignup } from '../../middlewares';
import assignToken from '../../utils/assignToken';

const authRouter = express.Router();

authRouter.post(
  '/create-account',
  validateSignup,
  validateExistingUser,
  createUser
);

authRouter.get('/login', (req, res) => {
  res.send('<a href="/v1/auth/google">Login with Google</a>');
});

authRouter.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

authRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/v1/auth/google/success',
    failureRedirect: '/v1/auth/google/failure',
  })
);

authRouter.get('/auth/google/success', (req, res) => {
  let token;
  if (req.user) {
    token = assignToken(req.user);
  }
  res.status(200).json({
    message: 'User login successful',
    user: req.user,
    token,
    success: true,
  });
});

authRouter.get('/auth/google/failure', (req, res) => {
  res.status(401).json({ message: 'Login failed, Invalid user credential' });
});

authRouter.post('/logout', logoutUser);

export default authRouter;
