// //IMPORTING LIBRABRIES FROM OTHER DIRECTORIES
// const mongoose = require("mongoose")
// const bcrypt = require("bcrypt");
// const crypto = require("crypto");

// //CREATING A USER MODEL SCHEMA
// const UserSchema = new mongoose.Schema({
//     firstname: {
//         type: String,
//         required: [true, "Enter your first name!"]
//     },
//     lastname: {
//         type: String,
//         required:  [true, "Enter your last name!"]
//     },
//     email: {
//         type: String,
//         required:  [true, "Enter your email!"],
//         unique: true,
//     },
//     phoneNumber:{
//         type: Number,
//     },
//     password: {
//         type: String,
//         required: [true, "Enter your password!"],
//         minLength: [8, "Password should be more than seven (7) characters"],
//     },
//     address: [
//         {
//         name:{
//             type: String,
//         },
//         address:{
//             type: String,
//         },
//         town:{
//             type: String,
//         },
//         phoneNumber:{
//             type: Number,
//         },
//         addressType:{
//             type: String,
//         },
//     }
// ],
//     role: {
//         type: String,
//         default: "user"
//     },
//     cart: {
//         type: Array,
//         default: []
//     },
//     avatar:{
//         type: String,
//         // required: true, //WILL BE SET TO REQUIRED LATER
//     },
//     wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
//     refreshToken: {
//         type: String,
//     },
// }, {timestamps: true});
// //EXPORTING MODULE TO BE USED OUTSIDE DIRECTORY
// module.exports = mongoose.model ("User", UserSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  profilePicture: {
    type: String
  },
  socialMediaLinks: {
    type: [String]
  },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  });

  //ENCRYPTING PASSWORD
UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        next();
    };
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//COMPARING ENTERED PASSWORD TO A PASSWORD IN DATABASE IN ENCRYPTION MODE
UserSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//RESETTING PASSWORD IN DATABASE
UserSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resettoken).digest("hex");
    this.passwordResetExpires = Date.now() + 30 + 60 + 1000; //10 Minutes
    return resettoken;
}
  module.exports = mongoose.model('User', UserSchema);