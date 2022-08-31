const mongoose = require('mongoose');

const Truck = mongoose.model('Truck', {
  type: {
    type: String,
    required: true,
  },
  dimensions: {
    width: { type: Number },
    length: { type: Number },
    height: { type: Number },
    payload: { type: Number },
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
