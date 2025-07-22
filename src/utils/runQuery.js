import {
  createUsersTable,
  dropAttendeesTables,
  createAttendeeTable,
  createEventCategoriesTable,
  dropEventTables,
  dropEventCategoryTables,
  dropUserTables,
  createEventsTable,
} from './queryFunction';

(async () => {
  // eslint-disable-next-line no-unused-expressions
  // await dropTables();
  await dropAttendeesTables();
  await dropEventTables();
  await dropEventCategoryTables();
  await dropUserTables();

  await createUsersTable();
  await createEventCategoriesTable();
  await createEventsTable();
  await createAttendeeTable();
})();
