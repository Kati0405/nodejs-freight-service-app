const express = require('express');

const router = express.Router();
const {
  getUserInfo,
  changeUserPassword,
  deleteUser,
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserInfo);

router.patch('/password', authMiddleware, changeUserPassword);

router.delete('/', authMiddleware, deleteUser);

module.exports = {
  userRouter: router,
};
