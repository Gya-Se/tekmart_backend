const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var InventorySchema = new mongoose.Schema({
    quantity:{
        type: Number,
        required: true,
    },

},
{timestamp: true}
);

//Export the model
module.exports = mongoose.model('Product Inventory', InventorySchema);