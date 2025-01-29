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

export const dropTables = () =>
  executeQueryArray([
    dropUserTable,
    dropEventCategoryTable,
    dropAttendeesTable,
    dropEventTable,
  ]);

export const createUsersTable = () => executeQueryArray([createUserTable]);
export const createTable = () =>
  executeQueryArray([
    createEventCategoryTable,
    createEventTable,
    createAttendeesTable,
  ]);

export const createAttendeeTable = () =>
  executeQueryArray([createAttendeesTable]);
