import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Model from '../models/model';
import { sendMail } from '../utils/sendMail';
import assignToken from '../utils/assignToken';
import { sendFeedbackMail } from '../utils/sendFeedbackMail';

const attendeeModel = new Model('attendees');
const userModel = new Model('user_details');
const eventModel = new Model('event');

dotenv.config();

export const createAttendingEvent = async (req, res) => {
  try {
    const checkIn = 'pending';
    const { userDetailsId } = req.user.userInfo;
    const { eventId } = req.params;

    const isUserAttending = await attendeeModel.select(
      '*',
      ` WHERE event_id = '${eventId}' AND attendee_id = '${userDetailsId}'`
    );

    if (isUserAttending.rowCount) {
      return res.status(400).json({
        message: 'You are not allowed to attend a event more than once',
        success: false,
      });
    }

    const selectEventName = await eventModel.select(
      'title',
      ` WHERE event_id ='${eventId}'`
    );
    const eventName = selectEventName.rows[0].title;

    const columns = 'event_id, attendee_id, check_in, event_name';
    const values = `'${eventId}', '${userDetailsId}', '${checkIn}', '${eventName}'`;
    await attendeeModel.insertWithReturn(columns, values);
    const userColumns = 'email, username';
    const userData = await userModel.select(
      userColumns,
      ` WHERE user_details_id = '${userDetailsId}'`
    );
    const { email, username } = userData.rows[0];
    const eventColumns = 'title, event_date, venue';
    const eventClause = ` WHERE event_id = '${eventId}'`;
    const eventData = await eventModel.select(eventColumns, eventClause);
    const { title, event_date: eventDate, venue } = eventData.rows[0];
    await sendMail({
      email,
      username,
      title,
      eventDate,
      venue,
      checkIn,
    });
    return res.status(200).json({
      message: 'Notification sent, pls check your mail',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error, success: false });
  }
};

export const getEventSummary = async (req, res) => {
  try {
    const result = await eventModel.getEventWithAttendeeCount();
    res.status(200).json({ data: result.rows, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const sendMailToAttendersForFeedback = async (req, res) => {
  const { eventId } = req.params;
  const { FRONTEND_URL } = process.env;

  try {
    const attendeeData = await attendeeModel.getAttendeeData(eventId);

    const mailPromises = attendeeData.rows.map((item) => {
      const { email, attendee_id: attendeeId, event_name: eventTitle } = item;
      const token = assignToken({ attendeeId, eventId });
      const verify = `${FRONTEND_URL}/feedback-form?token=${token}`;
      const content = `Hi, please we will like to get your feedback on the event. Click the link to continue <a href="${verify}">Post Feedback</a>`;
      return sendFeedbackMail(email, content, eventTitle);
    });
    await Promise.all(mailPromises);

    res
      .status(200)
      .json({ message: 'Notification sent to attendees', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const addFeedbackAndRating = async (req, res) => {
  const { feedback, rating, token } = req.body;
  try {
    const userData = jwt.verify(token, process.env.SECRET_KEY);
    const { attendeeId, eventId } = userData.userInfo;
    const data = { feedback, rating };
    const clause = ` WHERE attendee_id = '${attendeeId}' AND event_id = '${eventId}'`;
    const isSubmittedFeedback = await attendeeModel.select(
      'feedback, rating',
      ` WHERE attendee_id = '${attendeeId}' AND event_id = '${eventId}' AND (feedback IS NOT NULL OR rating IS NOT NULL)`
    );
    if (isSubmittedFeedback.rowCount) {
      return res.status(400).json({
        message: 'You can only send feedback once',
        success: false,
      });
    }
    await attendeeModel.editFromTable(data, clause);
    return res
      .status(200)
      .json({ message: 'Feedback and ratings added!', success: true });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getFeedbackAndRatings = async (req, res) => {
  try {
    const data = await attendeeModel.getFeedbackAndRating();
    res.status(200).json({
      message: data.rows,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error, success: false });
  }
};
