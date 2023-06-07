const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var CartSchema = new mongoose.Schema({
    products:[
        {
            product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
          },
          price: {
            type: Number,
          }
        }
    ],
    cartTotal: Number,
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

//Export the model
module.exports = mongoose.model('Cart', CartSchema);