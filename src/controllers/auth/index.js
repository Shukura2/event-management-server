import bcrypt from 'bcrypt';
import Model from '../../models/model';
import assignToken from '../../utils/assignToken';

export const userModel = new Model('user_details');

export const createUser = async (req, res) => {
  const { username, email, password, userRole } = req.body;
  const columns = `username, email, password, user_role`;
  const values = `'${username}', '${email}', '${password}', '${userRole}'`;

  try {
    const data = await userModel.insertWithReturn(columns, values);
    const { user_details_id: userDetailsId, username: name } = data.rows[0];
    const user = {
      userDetailsId,
      name,
      email,
      userRole,
    };
    const token = assignToken(user);
    res.status(200).json({
      message: 'User created successfully',
      user,
      token,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logout successful' });
    });
  });
};
