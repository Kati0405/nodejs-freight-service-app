const express = require('express');

const router = express.Router();

const { getWeatherInCity } = require('../controllers/weatherController');

const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getWeatherInCity);

module.exports = {
  weatherRouter: router,
};
