import { pool } from '../models/pool';
import {
  dropUserTable,
  createUserTable,
  dropEventTable,
  createEventTable,
  dropEventCategoryTable,
  createEventCategoryTable,
  dropAttendeesTable,
  createAttendeesTable,
} from './queries';

export const executeQueryArray = async (arr) =>
  new Promise((resolve) => {
    const stop = arr.length;
    arr.forEach(async (q, index) => {
      await pool.query(q);
      if (index + 1 === stop) resolve();
    });
  });

export const dropAttendeesTables = () =>
  executeQueryArray([dropAttendeesTable]);
export const dropEventTables = () => executeQueryArray([dropEventTable]);
export const dropEventCategoryTables = () =>
  executeQueryArray([dropEventCategoryTable]);
export const dropUserTables = () => executeQueryArray([dropUserTable]);

export const createUsersTable = () => executeQueryArray([createUserTable]);
export const createEventCategoriesTable = () =>
  executeQueryArray([createEventCategoryTable]);
export const createEventsTable = () => executeQueryArray([createEventTable]);
export const createAttendeeTable = () =>
  executeQueryArray([createAttendeesTable]);
