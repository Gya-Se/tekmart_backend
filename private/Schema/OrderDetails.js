const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var OrderDetailsSchema = new mongoose.Schema({
    total:{
        type: Number,
        required: true
    },
}, {
    timestamp: true,
});

//Export the model
module.exports = mongoose.model('Order Details', OrderDetailsSchema);