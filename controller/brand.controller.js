const Brand = require("../models/brand.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

//CREATE A BRAND
const createBrand = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);

    } catch (error) {
        throw new Error (error)
    }
});

//UPDATE A BRAND
const updateBrand = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateBrand = await Brand.findOneAndUpdate(id, req.body, {new: true});
        res.json(updateBrand);

    } catch (error) {
        throw new Error (error)
    }
});

//DELETE A BRAND
const deleteBrand = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json(deleteBrand);

    } catch (error) {
        throw new Error (error)
    }
});

//GET A BRAND
const getaBrand = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findBrand = await Brand.findById(id)
        res.json(findBrand);

    } catch (error) {
        throw new Error (error)
    }
});

//GETTING ALL BRAND
const getAllBrand = asyncHandler(async(req, res) => {
    try {
        const getBrand = await Brand.find();
        res.json(getBrand)
    } catch (error) {
        throw new Error(error);
    }
});

//EXPORT MODULES
module.exports = {
    createBrand,
    deleteBrand,
    updateBrand,
    getaBrand,
    getAllBrand,
};