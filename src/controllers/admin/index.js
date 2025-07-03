import Model from '../../models/model';
import { dataUri, uploadToCloud } from '../../utils/cloudinary';

export const eventModel = new Model('event');
export const eventCategoryModel = new Model('event_categories');

export const createEvent = async (req, res) => {
  try {
    const file = dataUri(req).content;
    const eventImage = await uploadToCloud(file);
    const {
      title, eventDate, eventTime, venue, organizer, categoryId
    } = req.body;
    const category = await eventCategoryModel.select(
      'title',
      ` WHERE id = '${categoryId}'`
    );
    const categoryName = category.rows[0].title;
    const columns = 'title, event_date, event_time, venue, organizer, event_image, category_id, category_name';
    const values = `'${title}', '${eventDate}', '${eventTime}', '${venue}', '${organizer}', '${eventImage}', '${categoryId}', '${categoryName}'`;
    const event = await eventModel.insertWithReturn(columns, values);
    res.status(200).json({
      message: 'Event successfully created',
      success: true,
      data: event.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  const clause = `event_id = '${eventId}'`;
  try {
    await eventModel.deleteFromTable(clause);
    res
      .status(200)
      .json({ message: 'Event deleted successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Event not deleted', success: false });
  }
};

export const getAllEventWithCategory = async (req, res) => {
  const { page, size, categoryId } = req.query;
  const columns = '*';
  const clause = ` WHERE category_id = '${categoryId}' LIMIT ${Number(size)} OFFSET ${Number(page)}`;

  try {
    const data = await eventModel.select(columns, clause);
    const totalSize = await eventModel.select('*');
    res.status(200).json({
      data: data.rows,
      success: true,
      page,
      size,
      totalSize: totalSize.rows.length,
    });
  } catch (error) {
    res.status(500).json({ message: error, success: false });
  }
};

export const getEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const columns = '*';
    const clause = ` WHERE event_id = '${eventId}'`;
    const data = await eventModel.select(columns, clause);
    res.status(200).json({ data: data.rows[0], success: true });
  } catch (error) {
    res.status(500).json({ data: error, success: false });
  }
};

export const getAllEvent = async (req, res) => {
  try {
    const columns = 'event_id, title';
    const data = await eventModel.select(columns);
    res.status(200).json({
      data: data.rows,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const editEvent = async (req, res) => {
  try {
    let eventImage;

    if (req.file) {
      const file = dataUri(req).content;
      eventImage = await uploadToCloud(file);
    }

    const {
      title, eventDate, eventTime, venue, organizer, categoryId
    } = req.body;

    const data = {
      title,
      event_date: eventDate,
      event_time: eventTime,
      venue,
      organizer,
      category_id: categoryId,
    };

    if (eventImage) {
      data.event_image = eventImage;
    }
    const { eventId } = req.params;

    const clause = `WHERE event_id = '${eventId}'`;
    await eventModel.editFromTable(data, clause);
    return res
      .status(200)
      .json({ message: 'Event updated successfully', success: true });
  } catch (error) {
    return res.status(500).json({ message: error, success: false });
  }
};
