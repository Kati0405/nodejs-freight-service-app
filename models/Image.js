const mongoose = require('mongoose');

const Image = mongoose.model('Image', {
  name: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = {
  Image,
};
