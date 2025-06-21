import {
  createUsersTable,
  createTable,
  dropTables,
  createAttendeeTable,
} from './queryFunction';

(async () => {
  // eslint-disable-next-line no-unused-expressions
  dropTables;
  await createUsersTable();
  await createTable();
  await createAttendeeTable();
})();
