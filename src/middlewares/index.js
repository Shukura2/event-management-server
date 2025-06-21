import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Model from '../models/model';

const userModel = new Model('user_details');
dotenv.config();

export const isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization;
  let tokenValue;
  try {
    if (token) {
      [ , tokenValue ] = token.split(' ');
      const userData = jwt.verify(tokenValue, process.env.SECRET_KEY);

      const isUserValid = await userModel.select(
        'user_details_id',
        ` WHERE user_details_id = '${userData.userInfo.userDetailsId}'`
      );
      req.user = userData;
      // eslint-disable-next-line prefer-destructuring
      req.token = token.split(' ')[1];
      if (userData && isUserValid.rowCount) {
        next();
      } else {
        res.status(401).json({
          message: 'Authentication token is invalid or expired',
          success: false,
        });
      }
    } else {
      res.status(401).json({
        message: 'Authentication token does not exist',
        success: false,
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication token is invalid or expired',
    });
  }
};

// eslint-disable-next-line consistent-return
export const verifyRole = (allowedUser) => (req, res, next) => {
  const role = req.user.userInfo.userRole;
  if (!allowedUser.includes(role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
