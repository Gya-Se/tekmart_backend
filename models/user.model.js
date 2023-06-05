const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstname: {
      type: String,
    required: [true, "Enter your first name!"],
      trim: true
  },
  lastname: {
      type: String,
      required:  [true, "Enter your last name!"]
 ,     trim:true
  },
  email: {
    type: String,
    required: [true, "Enter your email!"],
    unique: true,
    trim:true
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password should not be less than eight characters!"]
  },
  avatar: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    minLength: [10, "Phone number should not be less than ten!"],
    maxLength: [10, "Phone number should not be more than ten!"]
  },
  address: {
    name:{
      type: String,
    },
    address:{
        type: String,
    },
    town:{
        type: String,
    },
    phoneNumber:{
      type: String,
      minLength: [10, "Phone number should not be less than ten!"],
      maxLength: [10, "Phone number should not be more than ten!"]
    },
    addressType:{
      type: String,
    },
  },
  isBlocked: {
    type: Boolean,
},
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
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