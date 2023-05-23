const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema({
     products:[
    //     {
    //         product: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Product"
    //     },
    //         count: Number,
    //         color: String,
    //         price: Number,
    //     }
     ],
    paymentIntent: {
        id:{
            type: String,
        },
        status: {
            type: String,
        },
        type:{
            type: String,
        },
    },
    orderStatus:{
        // type: String,
        // default: "Not Processed",
        // enum: [
        //     "Not Processed",
        //     "Processing",
        //     "Dispatched",
        //     "Delivered",
        //     "Cancelled",
        // ]
    },
    orderby: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "User"
    },
    deliveredAt: {
        type: Date,
    },
}, {timestamps: true});

//Export the model
module.exports = mongoose.model('Order', OrderSchema);