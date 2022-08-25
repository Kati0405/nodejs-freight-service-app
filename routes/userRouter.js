const express = require('express');

const router = express.Router();
const {
  getUserInfo,
  changeUserPassword,
  deleteUser,
  uploadUserPhoto,
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserInfo);

router.patch('/password', authMiddleware, changeUserPassword);

router.delete('/', authMiddleware, deleteUser);

router.post('/upload_photo', authMiddleware, uploadUserPhoto);

module.exports = {
  userRouter: router,
};
