import express from 'express';
import {
  createEvent,
  deleteEvent,
  editEvent,
  getAllEvent,
  getEvent,
} from '../../controllers/admin';
import { isLoggedIn, verifyRole } from '../../middlewares';
import { validateEvent } from '../../middlewares/validateInputs';
import multer from 'multer';

const adminRouter = express.Router();
const storage = multer.memoryStorage();
const maxSize = 5 * 1024 * 1024;

export const uploads = multer({ storage, limits: { fileSize: maxSize } });

adminRouter.post(
  '/event',
  uploads.single('eventImage'),
  validateEvent,
  isLoggedIn,
  verifyRole(['admin']),
  createEvent
);
adminRouter.delete(
  '/event/:eventId',
  isLoggedIn,
  verifyRole(['admin']),
  deleteEvent
);
adminRouter.get(`/events`, getAllEvent);
adminRouter.get('/event/:eventId', getEvent);
adminRouter.put(
  '/event/:eventId',
  isLoggedIn,
  verifyRole(['admin']),
  editEvent
);

export default adminRouter;
