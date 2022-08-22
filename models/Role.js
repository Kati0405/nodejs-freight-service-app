const mongoose = require('mongoose');

const Role = mongoose.model('Role', {
  value: { type: String, unique: true },
  enum: ['DRIVER', 'SHIPPER'],
});

module.exports = {
  Role,
};
