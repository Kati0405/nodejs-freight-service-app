const mongoose = require('mongoose');

const DimensionSchema = mongoose.Schema({
  width: { type: Number },
  length: { type: Number },
  height: { type: Number },
});

const LogSchema = mongoose.Schema({
  message: { type: String },
  time: { type: Date, default: () => Date.now() },
});

const Load = mongoose.model('Load', {
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
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
  },
  payload: {
    type: Number,
  },
  pickupAddress: {
    type: String,
  },
  deliveryAddress: {
    type: String,
  },
  dimensions: {
    type: DimensionSchema,
  },
  logs: {
    type: [LogSchema],
    default: [],
  },
  createdDate: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  driver_found: {
    type: Boolean,
  },
});

module.exports = {
  Load,
};
