import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Model from '../models/model';
import { sendMail } from '../utils/sendMail';

const attendeeModel = new Model('attendees');
const userModel = new Model('user_details');
const eventModel = new Model('event');

dotenv.config();

export const createAttendingEvent = async (req, res) => {
  try {
    const checkIn = 'pending';
    const { userDetailsId } = req.user.userInfo;
    const { eventId } = req.params;
    const columns = `event_id, attendee_id, check_in`;
    const values = `'${eventId}', '${userDetailsId}', '${checkIn}'`;
    const data = await attendeeModel.insertWithReturn(columns, values);
    const userColumns = `email, username`;
    const userData = await userModel.select(
      userColumns,
      ` WHERE user_details_id = '${userDetailsId}'`
    );
    const { email, username } = userData.rows[0];
    const eventColumns = `title, event_date, venue`;
    const eventClause = ` WHERE event_id = '${eventId}'`;
    const eventData = await eventModel.select(eventColumns, eventClause);
    const { title, event_date: eventDate, venue } = eventData.rows[0];
    await sendMail({
      email,
      username,
      title,
      eventDate,
      venue,
      eventId,
      userDetailsId,
      checkIn,
    });
    res.status(200).json({ message: 'Notification received', success: true });
  } catch (error) {
    res.status(500).json({ message: error, success: false });
  }
};

export const getNumberOfAttendees = async (req, res) => {
  const { eventId } = req.params;
  try {
    const column = '*';
    const clause = `event_id = '${eventId}'`;

    const data = await attendeeModel.selectCount(column, clause);
    res.status(200).json({ data: data.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const addFeedbackAndRating = async (req, res) => {
  const { userDetailsId } = req.user.userInfo;
  const { eventId } = req.params;
  const { feedback, rating } = req.body;
  try {
    const data = { feedback, rating };
    const clause = `WHERE event_id = '${eventId}' AND attendee_id = '${userDetailsId}'`;

    const feedbackAndRating = await attendeeModel.editFromTable(data, clause);
    res
      .status(200)
      .json({ message: 'Feedback and ratings added!', success: true });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getFeedbackAndRatings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const column = 'feedback, rating';
    const clause = ` WHERE event_id = '${eventId}' AND (feedback IS NOT NULL OR rating IS NOT NULL)`;
    const data = await attendeeModel.select(column, clause);
    res.status(200).json({
      message: data.rows,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error, success: false });
  }
};

export const verifyQRCodeToken = async (req, res) => {
  const { token } = req.body;
  try {
    const verify = jwt.verify(token, process.env.SECRET_KEY);

    const isAttendeeValid = await attendeeModel.select(
      '*',
      ` WHERE attendee_id = '${verify.userInfo.userDetailsId}' AND event_id = '${verify.userInfo.eventId}'`
    );

    if (
      isAttendeeValid.rows[0].attendee_id !== verify.userInfo.userDetailsId &&
      isAttendeeValid.rows[0].event_id !== verify.userInfo.eventId
    ) {
      return res
        .status(400)
        .json({ message: 'Invalid QR Code', success: false });
    }
    if (isAttendeeValid.rows[0].check_in === 'checked in') {
      return res
        .status(400)
        .json({ message: 'Already checked in', success: false });
    }

    if (verify && isAttendeeValid.rowCount) {
      const updateCheckInStatus = { check_in: 'checked in' };
      const clause = `WHERE attendee_id = '${isAttendeeValid.rows[0].attendee_id}' AND event_id = '${verify.userInfo.eventId}'`;
      const data = await attendeeModel.editFromTable(
        updateCheckInStatus,
        clause
      );
      return res.status(200).json({
        message: 'User verified! Access ranted',
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Invalid QR Code', success: false });
  }
};
