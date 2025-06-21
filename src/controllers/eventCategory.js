import Model from '../models/model';

const eventCategoryModel = new Model('event_categories');

// eslint-disable-next-line consistent-return
export const createEventCategory = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ message: 'Title is required', success: false });
  }

  const columns = 'title';
  const values = `'${title}'`;
  try {
    const categoryLength = await eventCategoryModel.select('*');
    if (categoryLength.rowCount >= 4) {
      res.status(400).json({
        message: 'Category length max is 4',
        success: false,
      });
    } else {
      const data = await eventCategoryModel.insertWithReturn(columns, values);
      return res.status(200).json({
        message: 'Event caterogy created successfully',
        data: data.rows[0],
        success: true,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false });
  }
};

export const getAllEventCategory = async (req, res) => {
  const columns = '*';
  try {
    const data = await eventCategoryModel.select(columns);
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

export const deleteEventCategory = async (req, res) => {
  const { categoryId } = req.params;
  const clause = `id = '${categoryId}'`;
  try {
    await eventCategoryModel.deleteFromTable(clause);
    res
      .status(200)
      .json({ message: 'Event category deleted successfully', success: true });
  } catch (error) {
    res.status(500).json({
      message: 'Event category not deleted',
      success: false,
    });
  }
};

export const editEventCategory = async (req, res) => {
  const data = req.body;
  const { categoryId } = req.params;
  const clause = `WHERE id = '${categoryId}'`;
  try {
    await eventCategoryModel.editFromTable(data, clause);
    res
      .status(200)
      .json({ message: 'Event category updated successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: error, success: false });
  }
};
