const joi = require("joi");

const createUserSchema = joi.object({
    firstname: joi.string().alphanum().min(3).max(16).required(),
    lastname: joi.string().alphanum().min(3).max(16).required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(7).max(24).required(),
});

const updateUserSchema = joi.object({
    phone: joi.number().min(10).max(10),
    adress: joi.string().alphanum().min(3).max(16)
});

const createVendorSchema = joi.object({
    shopName: joi.string().alphanum().min(3).max(16).required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(7).max(24).required(),
    phone: joi.string().min(10).max(10),
})


module.exports = {
    createUserSchema,
    createVendorSchema
}