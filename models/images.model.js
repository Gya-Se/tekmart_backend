const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  url: [{
    type: String,
    required: true
  }],
},{timestamps:true});

module.exports = mongoose.model('Image', ImageSchema);