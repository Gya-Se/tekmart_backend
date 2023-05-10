const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var DiscountSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },

    description:{
        type: String,
        required: true,
    },

    discount_percent: {
        type: Number,
        required: true,
        min: 1,
        max: 2,
    },

    active: {
        type: Boolean,
        required: true,
    }
},
{timestamp: true}
);

//Export the model
module.exports = mongoose.model('Discount', DiscountSchema);