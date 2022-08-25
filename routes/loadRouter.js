const express = require('express');

const router = express.Router();

const {
  getLoads,
  createLoad,
  getLoadById,
  updateLoadById,
  deleteLoadById,
  postLoadById,
  getActiveLoad,
  getLoadShippingInfo,
  iterateToNextLoadState,
} = require('../controllers/loadsController');

const { roleMiddleware } = require('../middleware/roleMiddleware');

const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, roleMiddleware('SHIPPER'), getLoads);

router.post('/', authMiddleware, roleMiddleware('SHIPPER'), createLoad);

router.get('/active', authMiddleware, roleMiddleware('DRIVER'), getActiveLoad);

router.patch(
  '/active/state',
  authMiddleware,
  roleMiddleware('DRIVER'),
  iterateToNextLoadState,
);

router.get('/:id', authMiddleware, roleMiddleware('SHIPPER'), getLoadById);

router.put('/:id', authMiddleware, roleMiddleware('SHIPPER'), updateLoadById);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('SHIPPER'),
  deleteLoadById,
);

router.post(
  '/:id/post',
  authMiddleware,
  roleMiddleware('SHIPPER'),
  postLoadById,
);

router.get(
  '/:id/shipping_info',
  authMiddleware,
  roleMiddleware('SHIPPER'),
  getLoadShippingInfo,
);

module.exports = {
  loadRouter: router,
};
