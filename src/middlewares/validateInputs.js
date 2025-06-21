import Joi from 'joi';
import multer from 'multer';

// eslint-disable-next-line consistent-return
export const validateEvent = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    eventDate: Joi.date().iso().required(),
    eventTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
    venue: Joi.string().max(100).required(),
    organizer: Joi.string().max(50).required(),
    categoryId: Joi.string().required(),
  });

  try {
    await schema.validateAsync(req.body, { stripUnknown: true });
    if (!req.file) {
      return res
        .status(400)
        .json({ message: '"eventImage" is required', success: false });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.details[0].message, success: false });
  }
};

// eslint-disable-next-line consistent-return
export const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ message: 'File size exceeds the 5MB limit', success: false });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Only JPG, JPEG, and PNG files are allowed',
        success: false,
      });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message, success: false });
  }
  next();
};

export const validateFeedbackField = async (req, res, next) => {
  const schema = Joi.object({
    feedback: Joi.string().required(),
    rating: Joi.number().required(),
  });
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(500).json({ message: error.details[0].message });
  }
};
