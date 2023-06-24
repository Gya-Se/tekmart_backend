//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    createProduct,
    getAllProductUser,
    getVendorProducts,
    userGetVendorProducts,
    deleteProductById,
    updateProductById,
    getProductById, } = require("../controller/product.controller");
const {authenticateVendor, authenticateUser} = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multer");
const { review } = require("../controller/review.controller");
const router = express.Router();

//POST ROUTE
router.post("/create-product", upload.array("images"), authenticateVendor, createProduct);

//GET ROUTE
router.get("/all-products", authenticateUser, getAllProductUser);
router.get("/get-product/:id", authenticateUser, getProductById);
router.get("/vendor-products/:id", authenticateUser, userGetVendorProducts);
router.get("/your-products", authenticateVendor, getVendorProducts);

//DELETE ROUTE
router.delete("/delete-product/:id", authenticateVendor, deleteProductById); 

//PUT ROUTE
router.put("/update-product/:id", authenticateVendor, updateProductById);
router.put("/review-product/:id", authenticateUser, review);


//EXPORT ROUTE
module.exports = router;