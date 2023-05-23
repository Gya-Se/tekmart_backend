const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Enter your event product name!"],
    },
    description:{
        type: String,
        required:[true,"Enter your event product description!"],
    },
    category:{
        type: String,
        required:[true,"Enter your event product category!"],
    },
      status: {
        type: String,
        default: "Running",
      },
    tags:{
        type: String,
    },
    originalPrice:{
        type: Number,
    },
    discountPrice:{
        type: Number,
        required: [true,"Enter your event product price!"],
    },
    stock:{
        type: Number,
        required: [true,"Enter your event product stock!"],
    },
    images:[
        {
            type: String,
        },
    ],
    shopId:{
        type: String,
        required: true,
    },
    shop:{
        type: Object,
        required: true,
    },
    sold_out:{
        type: Number,
        default: 0,
    },
}, {timestamps: true});

module.exports = mongoose.model("Event", eventSchema);