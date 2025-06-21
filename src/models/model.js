import { pool } from './pool';

class Model {
  constructor(table) {
    this.pool = pool;
    this.table = table;
    this.pool.on(
      'error',
      (err, client) => `Error, ${err}, on idle client${client}`
    );
  }

  async select(columns, clause) {
    let query = `SELECT ${columns} FROM ${this.table}`;
    if (clause) query += clause;
    return this.pool.query(query);
  }

  async selectCount(columns, clause) {
    const query = `SELECT COUNT(${columns}) FROM ${this.table} WHERE ${clause}`;
    return this.pool.query(query);
  }

  async insertWithReturn(columns, values) {
    const query = `
          INSERT INTO ${this.table}(${columns})
          VALUES (${values})
          RETURNING *
      `;
    return this.pool.query(query);
  }

  async deleteFromTable(clause) {
    const query = `DELETE FROM ${this.table} WHERE ${clause}`;
    return this.pool.query(query);
  }

  // eslint-disable-next-line consistent-return
  async editFromTable(data, clause) {
    let query = `UPDATE ${this.table} SET `;
    const keys = Object.keys(data);
    let sqlQuery;
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      if (key === keys[keys.length - 1]) {
        sqlQuery = `"${key}" = '${data[key]}' `;
        query += `${sqlQuery}`;
        query += `${clause} RETURNING *`;
        return this.pool.query(query);
      }

      sqlQuery = `"${key}" = '${data[key]}',`;
      query += `${sqlQuery}`;
    }
  }

  async getEventWithAttendeeCount() {
    const query = `
      SELECT
        e.event_id,
        e.title AS event_name,
        COUNT(a.id) AS number_of_attendees
      FROM
        event e
      LEFT JOIN
        attendees a ON e.event_id = a.event_id
      GROUP BY
        e.event_id, e.title
    `;
    return this.pool.query(query);
  }

  async getAttendeeEmailWithAttendeeData(eventId) {
    const query = `SELECT attendee_id, event_name, email FROM attendees JOIN user_details ON user_details.user_details_id = attendees.attendee_id WHERE event_id = '${eventId}'`;
    return this.pool.query(query);
  }

  async getFeedbackAndRating() {
    const query = 'SELECT feedback, rating, username, avatar FROM attendees JOIN user_details ON attendees.attendee_id = user_details.user_details_id WHERE (feedback IS NOT NULL OR rating IS NOT NULL)';
    return this.pool.query(query);
  }
}

export default Model;
