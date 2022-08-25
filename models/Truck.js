const mongoose = require('mongoose');

const Truck = mongoose.model('Truck', {
  type: {
    type: String,
    required: true,
  },
  dimensions: {
    width: { type: Number, required: true },
    length: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  payload: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  status: {
    type: String,
    enum: ['IS', 'OL'],
    default: 'IS',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
});

module.exports = {
  Truck,
};
