// //IMPORTING METHODS FROM DIRECTORIES TO ROUTE
// const express = require("express");
// const { 
//     createProduct, 
//     getaProduct, 
//     getallProduct, 
//     updateProduct,
//     deleteProduct,
//     rating,
//     addToWishlist,
//     uploadImages, } = require("../controller/product.controller");
// const {
//     isUser, 
//     isSeller} = require("../middlewares/authMiddleware");
// const {
//     uploadPhoto,
//     productImgResize } = require("../middlewares/uploadImages");     
// const router = express.Router();

// //POST ROUTE
// router.post("/create-product", isSeller, createProduct);
// router.post("/upload/:id", isUser, isSeller, uploadPhoto.array("images", 5), productImgResize, uploadImages);
// router.post("/wishlist", isUser,  rating);

// //GET ROUTE
// router.get("/get-product/:id", getaProduct);
// router.get("/get-all-product", getallProduct);

// //PUT ROUTE
// router.put("/update-product/:id", isSeller, updateProduct);

// //DELETE ROUTE
// router.delete("/delete-product/:id",  isSeller, deleteProduct);

// //EXPORT ROUTE
// module.exports = router;