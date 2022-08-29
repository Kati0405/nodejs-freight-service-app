const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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

router.post(
  '/upload_photo',
  authMiddleware,
  upload.single('image'),
  uploadUserPhoto,
);

module.exports = {
  userRouter: router,
};
