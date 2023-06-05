const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    images: [{
      type: String,
      default: ""
    }],
    category: {
        type: String,
        required: true
    },
    color: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
  },
  ratings: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number
    },
    comment: {
      type: String
    },
    }
  },{timestamps: true});
  
module.exports = mongoose.model('Product', ProductSchema);