import Joi from 'joi';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Model from '../models/model';

const userModel = new Model('user_details');
dotenv.config();

export const validateSignup = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(25).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).max(25).required(),
    userRole: Joi.string().required(),
  });

  try {
    const value = await schema.validateAsync(req.body);
    const { password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    return next();
  } catch (error) {
    res.status(500).json({ message: error.details[0].message, success: false });
  }
};

export const validateExistingUser = async (req, res, next) => {
  const { email } = req.body;
  try {
    const validateEmail = await userModel.select(
      '*',
      ` WHERE "email" = '${email}'`
    );
    if (validateEmail.rowCount) {
      return res
        .status(400)
        .json({ message: 'User already exist', success: false });
    }
    return next();
  } catch (error) {
    throw error;
  }
};

export const isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization;
  let tokenValue;
  try {
    if (token) {
      [, tokenValue] = token.split(' ');
      const userData = jwt.verify(tokenValue, process.env.SECRET_KEY);

      const isUserValid = await userModel.select(
        'user_details_id',
        ` WHERE user_details_id = '${userData.userInfo.userDetailsId}'`
      );
      req.user = userData;
      req.token = token.split(' ')[1];
      if (userData && isUserValid.rowCount) {
        next();
      } else {
        res
          .status(401)
          .json({
            message: 'Authentication token is invalid or expired',
            success: false,
          });
      }
    } else {
      res
        .status(401)
        .json({
          message: 'Authentication token does not exist',
          success: false,
        });
    }
  } catch (error) {
    res
      .status(401)
      .json({
        success: false,
        message: 'Authentication token is invalid or expired',
      });
  }
};

export const verifyRole = (allowedUser) => {
  return (req, res, next) => {
    const role = req.user.userInfo.userRole;
    if (!allowedUser.includes(role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
