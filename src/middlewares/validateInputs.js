import Joi from 'joi';

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
    const value = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(500).json({ message: error.details[0].message });
  }
};
