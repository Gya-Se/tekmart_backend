//IMPORTING LIBRABRIES FROM OTHER DIRECTORIES
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//CREATING A USER MODEL SCHEMA
const UserSchema = new mongoose.Schema({
    
    first_name: {
        type: String,
        required: true
    },

    last_name: {
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

    role: {
        type: String,
        default: "user"
    },

    isBlocked: {
        type: Boolean,
        default: false,
    },

    cart: {
        type: Array,
        default: []
    },

    address: [{type: mongoose.Schema.Types.ObjectId, ref: "Address"}],

    wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],

    refreshToken: {
        type: String,
    }

}, {timestamps: true});


//ENCRYPTING PASSWORD
UserSchema.pre("save", async function (next) {
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
    this.passwordExpires = Date.now() + 30 + 60 + 1000; //10 Minutes
    return resettoken;
}


//EXPORTING MODULE TO BE USED OUTSIDE DIRECTORY
module.exports = mongoose.model ("User", UserSchema)