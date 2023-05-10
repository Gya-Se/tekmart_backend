const mongoose = require("mongoose")
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    // id: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     required: true
    // },

    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },

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

}, {timestamp: true});


UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model ("User", UserSchema)