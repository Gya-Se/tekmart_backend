const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ShoppingSessionSchema = new mongoose.Schema({
    quantity:{
        type: Number,
        required: true
    },
}, {
    timestamp: true,
});

//Export the model
module.exports = mongoose.model('Shopping Session', ShoppingSessionSchema);