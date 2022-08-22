const mongoose = require('mongoose');

const DimensionSchema = mongoose.Schema({
  width: { type: Number },
  length: { type: Number },
  height: { type: Number },
});

const Load = mongoose.model('Load', {
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  status: {
    type: String,
    enum: ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'],
    default: 'NEW',
  },
  state: {
    type: String,
    enum: [
      '',
      'En Route to Pick Up',
      'Arrived to Pick Up',
      'En Route to Delivery',
      'Arrived to Delivery',
    ],
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  payload: {
    type: Number,
    required: true,
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  dimensions: {
    type: DimensionSchema,
    required: true,
  },
  logs: {
    type: String,
    default: null,
  },
  createdDate: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

module.exports = {
  Load,
};
