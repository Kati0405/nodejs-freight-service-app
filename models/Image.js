const mongoose = require('mongoose');

const Image = mongoose.model('Image', {
  image: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = {
  Image,
};
