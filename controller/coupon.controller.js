const Coupon = require("../models/coupon.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

//CREATE A COUPON
const createCoupon = asyncHandler( async(req, res) => {

    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);

    } catch (error) {
        throw new Error (error)
    }
});

//UPDATE A COUPON
const updateCoupon = asyncHandler( async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updateCoupon);

    } catch (error) {
        throw new Error (error)
    }
});


//DELETE A COUPON
const deleteCoupon = asyncHandler( async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupon);

    } catch (error) {
        throw new Error (error)
    }
});


//GET A COUPON
const getaCoupon = asyncHandler( async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const findCoupon = await Coupon.findById(id)
        res.json(findCoupon);

    } catch (error) {
        throw new Error (error)
    }
});

//GETTING ALL COUPONS
const getAllCoupons = asyncHandler(async(req, res) => {
    try {
        const getCoupons = await Coupon.find();
        res.json(getCoupons)
    } catch (error) {
        throw new Error(error);
    }

});



module.exports = {createCoupon, updateCoupon, getaCoupon, deleteCoupon, getAllCoupons};