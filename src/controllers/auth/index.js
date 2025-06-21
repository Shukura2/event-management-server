import Model from '../../models/model';
import assignToken from '../../utils/assignToken';

export const userModel = new Model('user_details');

export const createUser = async (req, res) => {
  const { username, email, avatar } = req.body;
  const isUserExist = await userModel.select('*', ` WHERE "email" ='${email}'`);

  if (isUserExist.rowCount) {
    const { user_details_id: userDetailsId, user_role: userRole } = isUserExist.rows[0];
    const user = {
      userDetailsId,
      username,
      email,
      userRole,
      avatar,
    };
    const token = assignToken(user);
    res.status(200).json({ user, token, message: 'Login successfully' });
  } else {
    const columns = 'username, email, avatar';
    const values = `'${username}', '${email}', '${avatar}'`;
    const data = await userModel.insertWithReturn(columns, values);
    const { user_details_id: userDetailsId, user_role: userRole } = data.rows[0];
    const user = {
      userDetailsId,
      username,
      email,
      avatar,
      userRole,
    };
    const token = assignToken(user);
    res.status(200).json({ user, token, message: 'Signup successfully!' });
  }
};
