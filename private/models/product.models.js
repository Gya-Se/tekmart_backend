const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },

    description:{
        type: String,
        required: true,
    },

    price:{
        type:String,
        required:true,
    },

    delivery:{
        type: Array,
        required: true,
    },
},
{timestamps: true}
);

//Export the model
module.exports = mongoose.model('Product', ProductSchema);