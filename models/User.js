const mongoose = require('mongoose');

const User = mongoose.model('User', {
  role: { type: String, ref: 'Role' },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  resetLink: {
    data: String,
    default: '',
  },
});

module.exports = {
  User,
};
