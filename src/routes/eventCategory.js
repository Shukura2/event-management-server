import express from 'express';
import {
  createEventCategory,
  deleteEventCategory,
  editEventCategory,
  getAllEventCategory,
} from '../controllers/eventCategory';
import { isLoggedIn, validateExistingUser, verifyRole } from '../middlewares';

const eventCategoryRouter = express.Router();

eventCategoryRouter.post(
  '/event-category',
  isLoggedIn,
  verifyRole(['admin']),
  createEventCategory
);

eventCategoryRouter.get(
  '/event-categories',
  isLoggedIn,
  verifyRole(['admin']),
  getAllEventCategory
);

eventCategoryRouter.delete(
  '/event-category/:categoryId',
  isLoggedIn,
  verifyRole(['admin']),
  deleteEventCategory
);

eventCategoryRouter.put(
  '/event-category/:categoryId',
  isLoggedIn,
  verifyRole(['admin']),
  editEventCategory
);

export default eventCategoryRouter;
