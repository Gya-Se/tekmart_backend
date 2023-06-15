const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentIntent: {
    type: String,
    required: true
  },
  shippingAddress: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered'],
    default: 'pending'
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);