const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js');

const DOMAIN = 'sandboxd9edd537372c4011a60a0a3d2f462981.mailgun.org';

const { validationResult } = require('express-validator');
const { User } = require('../models/User');
const { Role } = require('../models/Role');

const secret = process.env.SECRET;

const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

const generateAccessToken = (id, role, email) => {
  const payload = {
    id,
    role,
    email,
  };
  return jwt.sign(payload, secret);
};

async function registerUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error' });
    }
    const { email, password, role } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      return res.status(400).json({ message: 'This email is already in use' });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const userRole = await Role.findOne({ value: role });
    const user = new User({
      email,
      password: hashPassword,
      role: userRole.value,
    });
    await user.save();
    return res.json({ message: 'User was registered successfully' });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Registration error' });
  }
  return null;
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: `User ${email} not found` });
    }
    const validPassword = bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    const jwt_token = generateAccessToken(user._id, user.role, user.email);
    return res.json({ jwt_token });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Login error' });
  }
  return null;
}

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    console.log(e);
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  await User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ message: 'User with this email does not exist' });
    }
    const jwt_token = jwt.sign({ _id: user._id }, secret);
    const data = {
      from: 'noreply@hello.com',
      to: email,
      subject: 'Reset password',
      html: `
        <h2>Please click on given link to reset your password</h2>
        <p>${process.env.CLIENT_URL}/api/auth/resetpassword/${jwt_token}</p>
        `,
    };

    return user.updateOne({ resetLink: jwt_token }, () => {
      if (err) {
        return res.status(400).json({ message: 'Reset password link error' });
      }
      mg.messages().send(data, (error) => {
        if (error) {
          return res.json({
            error: error.message,
          });
        }
        return res.json({
          message: 'Reset pasword link was sent to your email address',
        });
      });
      return null;
    });
  });
}

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  forgotPassword,
};
