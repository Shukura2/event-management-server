import Model from '../../models/model';
import { dataUri, uploadToCloud } from '../../utils/cloudinary';

export const eventModel = new Model('event');

export const createEvent = async (req, res) => {
  try {
    if (req.file) {
      const file = dataUri(req).content;
      const eventImage = await uploadToCloud(file);

      const { title, eventDate, eventTime, venue, organizer, categoryId } =
        req.body;

      const columns = `title, event_date, event_time, venue, organizer, event_image, category_id`;
      const values = `'${title}', '${eventDate}', '${eventTime}', '${venue}', '${organizer}', '${eventImage}', '${categoryId}'`;
      const event = await eventModel.insertWithReturn(columns, values);

      res.status(200).json({
        message: 'Event successfully created',
        success: true,
        data: event.rows[0],
      });
    } else {
      res.status(400).json({ message: 'No file added', success: false });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
    });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  const clause = `event_id = '${eventId}'`;
  try {
    const data = await eventModel.deleteFromTable(clause);
    res
      .status(200)
      .json({ message: 'Event deleted successfully', success: true });
  } catch (error) {
    res.status(500).json({
      message: 'Event not deleted',
      success: false,
    });
  }
};

export const getAllEvent = async (req, res) => {
  const { page, size, categoryId } = req.query;
  console.log({ page, size, categoryId }, 'ans');
  const columns = '*';
  const clause = ` WHERE category_id = '${categoryId}' LIMIT ${parseInt(size)} OFFSET ${parseInt(page)}`;

  try {
    const data = await eventModel.select(columns, clause);
    console.log(data, 'ddata');
    const totalSize = await eventModel.select('*');
    res.status(200).json({
      message: data.rows,
      success: true,
      page,
      size,
      totalSize: totalSize.rows.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, success: false });
  }
};

export const getEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const columns = '*';
    const clause = ` WHERE event_id = '${eventId}'`;
    const data = await eventModel.select(columns, clause);
    res.status(200).json({
      message: data.rows[0],
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error, success: false });
  }
};

export const editEvent = async (req, res) => {
  const data = req.body;

  const { eventId } = req.params;
  const clause = `WHERE event_id = '${eventId}'`;
  try {
    const editData = await eventModel.editFromTable(data, clause);
    res
      .status(200)
      .json({ message: 'Event updated successfully', success: true });
  } catch (error) {
    console.log(error);
  }
};
