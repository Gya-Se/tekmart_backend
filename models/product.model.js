const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    vendor: {
      type: String,
      ref: 'Vendor',
      required: true
    },
    name: {
      type: String,
  },
  // slug: {
  //   type: String,
  //   lowercase: true,
  //   unique: true
  //   },
    description: {
      type: String,
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
  },{timestamps: true});
  
module.exports = mongoose.model('Product', ProductSchema);