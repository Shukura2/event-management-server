import {
  createUsersTable,
  createTable,
  dropTables,
  createAttendeeTable,
} from './queryFunction';

(async () => {
  dropTables;
  await createUsersTable();
  await createTable();
  await createAttendeeTable();
})();
