//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    createCategory,
    getaCategory,
    getAllCategory,
    updateCategory,
    deleteCategory, } = require("../controller/category.controller");
const {
    authMiddleware,
    isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();


//POST ROUTE
router.post("/create-category", authMiddleware, isAdmin, createCategory);

//GET ROUTE
router.get("/get-all-categories", getAllCategory);
router.get("/get-category/:id", getaCategory);

//PUT ROUTE
router.put("/update-category/:id", authMiddleware, isAdmin, updateCategory);

//DELETE ROUTE
router.delete("/delete-category/:id", authMiddleware, isAdmin, deleteCategory);

//EXPORT ROUTE
module.exports = router;