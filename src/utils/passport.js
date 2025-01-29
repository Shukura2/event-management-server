import passport from 'passport';
import dotenv from 'dotenv';
import { userModel } from '../controllers/auth';

dotenv.config();

const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const columns = `*`;
        const clause = ` WHERE email='${profile.emails[0].value}'`;

        const currentUser = await userModel.select(columns, clause);
        if (!currentUser.rows || currentUser.rows.length === 0) {
          return done(null, false);
        }

        const user = {
          userDetailsId: currentUser?.rows[0]?.user_details_id,
          name: profile.displayName,
          email: profile.emails[0].value,
          userRole: currentUser.rows[0].user_role,
        };
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
