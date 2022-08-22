const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const controller = require('../controllers/authController');

const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.post(
  '/register',
  check('email', 'Email should not be empty').notEmpty(),
  check('password', 'Password shoul be at least 5 characters long').isLength({
    min: 4,
  }),
  controller.registerUser,
);

router.post('/login', controller.loginUser);

router.get('/users', roleMiddleware(['DRIVER']), controller.getUsers);

router.post('/forgot_password', controller.forgotPassword);

module.exports = {
  authRouter: router,
};
