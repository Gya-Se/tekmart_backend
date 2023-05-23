const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var CouponSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please enter your coupoun code name!"],
        unique: true,
        uppercase: true,
    },
    expiry:{
        type: Date,
        required: true,
    },
    discount:{
        type: Number,
        required: true,
    },
    shopId:{
        type: String,
        required: true,
       },
});

//Export the model
module.exports = mongoose.model('Coupon', CouponSchema);