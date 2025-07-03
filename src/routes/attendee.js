import express from 'express';
import {
  createAttendingEvent,
  getEventSummary,
  getFeedbackAndRatings,
  sendMailToAttendersForFeedback,
  verifyQRCodeToken,
  addFeedbackAndRating,
} from '../controllers/attendee';
import { isLoggedIn, verifyRole } from '../middlewares';
import { validateFeedbackField } from '../middlewares/validateInputs';

const attendeeRouter = express.Router();

attendeeRouter.post(
  '/attending-event/:eventId',
  isLoggedIn,
  verifyRole([ 'attendee' ]),
  createAttendingEvent
);

attendeeRouter.get(
  '/event-summary',
  isLoggedIn,
  verifyRole([ 'admin' ]),
  getEventSummary
);

attendeeRouter.get('/feedbacks-and-ratings', getFeedbackAndRatings);

attendeeRouter.post(
  '/feedback-and-ratings/:eventId',
  isLoggedIn,
  verifyRole([ 'admin' ]),
  sendMailToAttendersForFeedback
);

attendeeRouter.put(
  '/feedback-and-ratings',
  validateFeedbackField,
  addFeedbackAndRating
);

attendeeRouter.post(
  '/verify-qr-token',
  isLoggedIn,
  verifyRole([ 'admin' ]),
  verifyQRCodeToken
);

export default attendeeRouter;
