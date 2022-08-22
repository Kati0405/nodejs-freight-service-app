const bcrypt = require('bcryptjs');
const { User } = require('../models/User');

const getUserInfo = async (req, res) => {
  try {
    User.findById(req.user.id).then((user) => {
      res.status(200).send({ user });
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const changeUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ email: req.user.email });
  if (await bcrypt.compare(String(oldPassword), String(user.password))) {
    await User.updateOne(
      { email: req.user.email },
      { $set: { password: await bcrypt.hash(newPassword, 10) } },
    );
    res.status(200).send({ message: 'Success' });
  } else {
    res.status(400).send({ message: 'Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    User.findByIdAndDelete(req.user.id).then(() => {
      res.status(200).send({ message: 'Profile deleted successfully' });
    });
  } catch (err) {
    res.status(400).send('Error');
  }
};

module.exports = {
  getUserInfo,
  changeUserPassword,
  deleteUser,
};
