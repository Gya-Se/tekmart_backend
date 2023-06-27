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
  totalPrice: {
    type: Number,
    required: true
  },
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
    type: {
      type: String,
    },
    created: {
      type: Date,
    }
  },
  deliveryAddress: {
    type: Object,
    required: true
  },
  orderStatus: {
    type: String,
    default: 'Processing'
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);