const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var PayDetailsSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: true
    },

    payment_type:{
        type: String,
        required: true,
    },

    status:{
        type: String,
        required: true,
    },
}, {
    timestamp: true,
});

//Export the model
module.exports = mongoose.model('Payment Details', PayDetailsSchema);