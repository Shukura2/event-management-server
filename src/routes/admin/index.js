import express from 'express';
import multer from 'multer';
import {
  createEvent,
  deleteEvent,
  editEvent,
  getAllEvent,
  getEvent,
} from '../../controllers/admin';
import { isLoggedIn, verifyRole } from '../../middlewares';
import {
  handleMulterErrors,
  validateEvent,
} from '../../middlewares/validateInputs';

const adminRouter = express.Router();

const storage = multer.memoryStorage();
const maxSize = 5 * 1024 * 1024;
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        'Only JPG, JPEG and PNG files are allowed'
      )
    );
  }
};

export const uploads = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter,
});

adminRouter.post(
  '/event',
  uploads.single('eventImage'),
  handleMulterErrors,
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
adminRouter.get('/events', getAllEvent);
adminRouter.get('/event/:eventId', getEvent);
adminRouter.put(
  '/event/:eventId',
  uploads.single('eventImage'),
  handleMulterErrors,
  validateEvent,
  isLoggedIn,
  verifyRole(['admin']),
  editEvent
);

export default adminRouter;
