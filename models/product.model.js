const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 0
  },
  images: [{
    type: String,
    default: ""
  }],
  sold: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
  },
  color: {
    type: String,
  },
  brand: {
    type: String,
  },
  ratings: [{
    star: Number,
    comment: String,
    postedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  },],
  totalrating: {
    type: String,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);