const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema({

    address: {

        address_line: {
            type: String,
            required: true
        },       

        street: {
            type: String,
            required: true
        },
        
        town: {
            type: String,
            required: true
        }

    },

    telephone: {
        type: Number,
        required: true,
        max: 10,
        min: 10,
    }


},
{
    timestamp: true,
});


module.exports = mongoose.model ("Address", AddressSchema);