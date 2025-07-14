import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';
import eventCategoryRouter from './routes/eventCategory';
import attendeeRouter from './routes/attendee';

const app = express();
dotenv.config();

app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
// app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1', authRouter);
app.use('/v1', adminRouter);
app.use('/v1', eventCategoryRouter);
app.use('/v1', attendeeRouter);
app.use((err, req, res, next) => {
  console.error('Error caught:', err);
  res.status(500).json({ error: err.stack || 'Internal Server Error' });
});
// app.use((err, req, res) => {
//   res.status(400).json({ error: err.stack });
// });
app.get('/', (req, res) => {
  res.send('Backend is running on Render 🎉');
});

export default app;
