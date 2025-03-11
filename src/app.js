import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import authRouter from './routes/auth';
import './utils/passport';
import adminRouter from './routes/admin';
import eventCategoryRouter from './routes/eventCategory';
import attendeeRouter from './routes/attendee';

const app = express();

dotenv.config();

app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/v1', authRouter);
app.use('/v1', adminRouter);
app.use('/v1', eventCategoryRouter);
app.use('/v1', attendeeRouter);
app.use((err, req, res) => {
  res.status(400).json({ error: err.stack });
});

export default app;
