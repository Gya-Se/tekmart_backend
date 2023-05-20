const Category = require("../models/category.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

//CREATE A CATEGORY
const createCategory = asyncHandler( async(req, res) => {
    // const { id } = req.user;
    // validateMongoDbId(id);
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);

    } catch (error) {
        throw new Error (error)
    }
});

//UPDATE A CATEGORY
const updateCategory = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCategory = await Category.findOneAndUpdate(id, req.body, {new: true});
        res.json(updateCategory);

    } catch (error) {
        throw new Error (error)
    }
});

//DELETE A CATEGORY
const deleteCategory = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json(deleteCategory);

    } catch (error) {
        throw new Error (error)
    }
});

//GET A CATEGORY
const getaCategory = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findCategory = await Category.findById(id)
        res.json(findCategory);

    } catch (error) {
        throw new Error (error)
    }
});

//GETTING ALL CATEGORY
const getAllCategory = asyncHandler(async(req, res) => {
    try {
        const getCategory = await Category.find();
        res.json(getCategory)
    } catch (error) {
        throw new Error(error);
    }
});

//EXPORT MODULES
module.exports = {
    createCategory,
    deleteCategory,
    updateCategory,
    getaCategory,
    getAllCategory,
};