const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const PaymentSchema = new mongoose.Schema({
    card: {

        //THE USER CREDIT CARD DETAILS
        card_provider: {
            type: String,
            required: true,
        },

        card_number: {
            type: String,
            required: true,
            unique: true,
        },

        card_name: {
            type: String,
            required: true,
        },

        expiry_date: {
            type: Date,
            required: true,
        },

        cvc_code: {
            type: String,
            required: true,
            min: 3,
        }
    },

    //THE USER MOBILE MONEY ACCOUNT DETAILS
    momo:{
        provider: {
            type: String,
            required: true,
        },

        account_name: {
            type: String,
            required: true,
            unique: true,
        },

        account_number: {
            type: String,
            required: true,
            unique: true,
            min: 10,
        }
    }
});

//Export the model
module.exports = mongoose.model('PAYMENT', PaymentSchema);