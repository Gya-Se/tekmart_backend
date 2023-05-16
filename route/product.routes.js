const express = require("express");
const { 
    createProduct, 
    getaProduct, 
    getallProduct, 
    updateProduct,
    deleteProduct, } = require("../controller/product.controller");
const router = express.Router();
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware");



router.post("/create-product", authMiddleware, isAdmin, createProduct);
router.get("/get-product/:id", getaProduct);
router.put("/update-product/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/delete-product/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/get-all-product", getallProduct);

module.exports = router;