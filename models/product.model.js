const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description:{
        type: String,
        required: [true, "Enter your product description!"],
    },
    price:{
        type: Number,
        required: true,
    },
    tags: {
        type: String,
      },
    category:{
        type: String,
        required: [true, "Enter product category!"],
    },
    brand:{
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: [true, "Enter product quantity!"],
      },
    sold: {
        type: Number,
        default: 0,
    },
    images: [{
        type: String,
    },],
    color: {
        type: String,
        required: true,
    },
    review: {
        star: Number,
        comment: String,
        postedby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    rating: {
        type: String,
        default: 0,
    },
    shopId: {
        type: String,
        required: true,
      },
      shop: {
        type: Object,
        required: true,
      },
},
{timestamps: true}
);

//Export the model
module.exports = mongoose.model('Product', ProductSchema);