const express = require('express');

const router = express.Router();

const {
  getLoads,
  createLoad,
  getLoadById,
  updateLoadById,
  deleteLoadById,
} = require('../controllers/loadsController');

const { roleMiddleware } = require('../middleware/roleMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, roleMiddleware('SHIPPER'), getLoads);

router.post('/', authMiddleware, roleMiddleware('SHIPPER'), createLoad);

router.get('/:id', authMiddleware, roleMiddleware('SHIPPER'), getLoadById);

router.put('/:id', authMiddleware, roleMiddleware('SHIPPER'), updateLoadById);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('SHIPPER'),
  deleteLoadById,
);

module.exports = {
  loadRouter: router,
};
