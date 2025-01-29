import Model from '../models/model';
import { sendMail } from '../utils/sendMail';
import QRCode from 'qrcode';

const attendeeModel = new Model('attendees');

export const createAttendingEvent = async (req, res) => {
  try {
    const { userDetailsId } = req.user.userInfo;
    const { eventId } = req.params;
    const columns = ` event_id, attendee_id`;
    const values = `'${eventId}', '${userDetailsId}'`;
    const data = await attendeeModel.insertWithReturn(columns, values);
    // send admin message that soso will be attending the event
    res.status(200).json({ message: 'Notification received', success: true });
  } catch (error) {
    console.log(error, 'error attendee');
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
    // sendMail();
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
    console.log(data, 'data');
    res.status(200).json({
      message: data.rows,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error, success: false });
  }
};
