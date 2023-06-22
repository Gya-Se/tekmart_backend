//IMPORTING LIBRABRIES FROM OTHER DIRECTORIES
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//CREATING A SELLER MODEL SCHEMA
var VendorSchema = new mongoose.Schema({
  shopName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: "vendor",
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: "",
  },
  withdrawMethod: {
    type: Object,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
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
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 Minutes
  return resettoken;
}

//Export the model
module.exports = mongoose.model('Vendor', VendorSchema);