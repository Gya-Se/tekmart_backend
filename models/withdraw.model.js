const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Processing",
  },
}, { timestamps: true });

module.exports = mongoose.model("Withdraw", withdrawSchema);