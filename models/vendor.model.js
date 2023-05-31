//IMPORTING LIBRABRIES FROM OTHER DIRECTORIES
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//CREATING A SELLER MODEL SCHEMA
var VendorSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: [true, "Enter your shop name!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Enter your shop email address"],
  },
  password: {
    type: String,
    required: [true, "Enter your password"],
    minLength: [8, "Password should be more than seven (7) characters"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Enter your Number"],
    minLength: [10, "Number should be more than nine (9) characters"],
  },
  description: {
    type: String,
  },
  address: [
  {
  address:{
    type: String,
  },
  town:{
    type: String,
  },
  }
  ],
  role: {
    type: String,
    default: "seller",
  },
  avatar: {
    type: String,
    required: true,
  },
  withdrawMethod: {
    type: Object,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  transactions: [
  {
  amount: {
    type: Number,
    required: true,
  },
    status: {
    type: String,
    default: "Processing",
      },
    },
  ],
  refreshToken: {
    type: String,
},
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true, });

//ENCRYPTING PASSWORD
VendorSchema.pre("save", async function (next) {
  if(!this.isModified("password")){
      next();
  };
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//COMPARING ENTERED PASSWORD TO A PASSWORD IN DATABASE IN ENCRYPTION MODE
VendorSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//RESETTING PASSWORD IN DATABASE
VendorSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resettoken).digest("hex");
  this.passwordResetExpires = Date.now() + 30 + 60 + 1000; //10 Minutes
  return resettoken;
}

//Export the model
module.exports = mongoose.model('Vendor', VendorSchema);