import express from 'express';
import {
  addFeedbackAndRating,
  createAttendingEvent,
  getFeedbackAndRatings,
  getNumberOfAttendees,
} from '../controllers/attendee';
import { isLoggedIn, verifyRole } from '../middlewares';

const attendeeRouter = express.Router();

attendeeRouter.post(
  '/attending-event/:eventId',
  isLoggedIn,
  verifyRole(['attendee']),
  createAttendingEvent
);

attendeeRouter.get(
  '/attending-event/:eventId',
  isLoggedIn,
  verifyRole(['admin']),
  getNumberOfAttendees
);

attendeeRouter.put(
  '/feedback-and-ratings/:eventId',
  isLoggedIn,
  verifyRole(['attendee']),
  addFeedbackAndRating
);

attendeeRouter.get('/feedbacks-and-ratings/:eventId', getFeedbackAndRatings);

export default attendeeRouter;
