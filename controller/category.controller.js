const Category = require("../models/category.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

//CREATE A PRODUCT
const createCategory = asyncHandler( async(req, res) => {
    //validateMongoDbId(id);
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);

    } catch (error) {
        throw new Error (error)
    }
});



module.exports = {createCategory};