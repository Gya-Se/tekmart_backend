const express = require("express");
const { 
    createProduct, 
    getaProduct, 
    getallProduct, 
    updateProduct,
    deleteProduct,
    rating,
    addToWishlist,
    uploadImages, } = require("../controller/product.controller");
const router = express.Router();
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");



router.post("/create-product", authMiddleware, isAdmin, createProduct);
router.post("/pload/:id", authMiddleware, isAdmin, 
    uploadPhoto.array("images", 10), productImgResize, uploadImages);
router.get("/get-product/:id", getaProduct);
router.post("/wishlist", authMiddleware, isAdmin, addToWishlist);
router.post("/rating", authMiddleware, rating);

router.put("/update-product/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/delete-product/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/get-all-product", getallProduct);

module.exports = router;