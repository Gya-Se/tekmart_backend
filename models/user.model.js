const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstname: {
      type: String,
      trim: true
  },
  lastname: {
      type: String,
     trim:true
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: [{
    streetAddress: {
      type: String,
    },
    town: {
      type: String,
    },
    addressType: {
      type: String,
    },
  }],
  role: {
    type: String,
    default: 'customer'
  },
  cart: [],
    refreshToken: {
     type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  }, {timestamps: true});

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