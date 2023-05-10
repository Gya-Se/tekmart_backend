const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var StoreSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        unique:true,
    },

    description:{
        type: String,
        required:true,
    },
},
{
    timestamp: true,
});

//Export the model
module.exports = mongoose.model('Store', StoreSchema);