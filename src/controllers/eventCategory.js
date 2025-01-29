import Model from '../models/model';

const eventCategoryModel = new Model('event_categories');

export const createEventCategory = async (req, res) => {
  const { title } = req.body;

  const columns = `title`;
  const values = `'${title}'`;
  try {
    const data = await eventCategoryModel.insertWithReturn(columns, values);
    res.status(200).json({
      message: 'Event caterogy created successfully',
      data: data.rows[0],
      success: true,
    });
  } catch (error) {
    console.log(error, 'er');
    res.status(500).json({ message: error, success: false });
  }
};

export const getAllEventCategory = async (req, res) => {
  const columns = '*';
  try {
    const data = await eventCategoryModel.select(columns);
    console.log(data, 'data');
    res.status(200).json({
      data: data.rows,
      success: true,
    });
  } catch (error) {
    console.log(error, 'get all event error');
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteEventCategory = async (req, res) => {
  const { categoryId } = req.params;
  const clause = `id = '${categoryId}'`;
  try {
    const data = await eventCategoryModel.deleteFromTable(clause);
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
    const editEventCat = await eventCategoryModel.editFromTable(data, clause);
    res
      .status(200)
      .json({ message: 'Event category updated successfully', success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, success: false });
  }
};
