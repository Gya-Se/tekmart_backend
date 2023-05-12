const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },

    description:{
        type: String,
        required: true,
    },
},
{timestamps: true}
);

//Export the model
module.exports = mongoose.model('Product Category', CategorySchema);