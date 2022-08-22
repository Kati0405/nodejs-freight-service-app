const express = require('express');

const router = express.Router();

const {
  getTrucks,
  createTruck,
  getTruckById,
  updateTruckById,
  deleteTruckById,
  assignTruckById,
} = require('../controllers/trucksController');

const { roleMiddleware } = require('../middleware/roleMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, roleMiddleware('DRIVER'), getTrucks);

router.post('/', authMiddleware, roleMiddleware('DRIVER'), createTruck);

router.get('/:id', authMiddleware, roleMiddleware('DRIVER'), getTruckById);

router.put('/:id', authMiddleware, roleMiddleware('DRIVER'), updateTruckById);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('DRIVER'),
  deleteTruckById,
);

router.delete(
  '/:id/assign',
  authMiddleware,
  roleMiddleware('DRIVER'),
  assignTruckById,
);

module.exports = {
  truckRouter: router,
};
