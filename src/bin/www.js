import debug from 'debug';
import http from 'http';
import dotenv from 'dotenv';
import app from '../app';
import {
  createAttendeeTable,
  createEventCategoriesTable,
  createEventsTable,
  createTableUuid,
  createUsersTable,
} from '../utils/queryFunction';

dotenv.config();

const port = process.env.PORT || 5000;

const server = http.createServer(app);
(async () => {
  await createTableUuid();
  await createUsersTable();
  await createEventCategoriesTable();
  await createEventsTable();
  await createAttendeeTable();
})();

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
    case 'EACCES':
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};

server.listen(port, () => console.log(`server running on port ${port}`));
server.on('error', onError);
server.on('listening', onListening);
