//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    productSearch,
    getVendorProducts,
    userGetVendorProducts,
    productQuery,
    getNewArrivals,
    getTopDeals,
    getTopVendors,
    getTopBrands,
    getTopCats, } = require("../controller/product.controller");
const { review } = require("../controller/review.controller");
const { authenticateVendor, authenticateUser } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multer");
const router = express.Router();

//POST ROUTE
router.post("/create-product", upload.array("images"), authenticateVendor, createProduct);

//GET ROUTE
router.get("/all-products", getNewArrivals);
router.get("/new-arrivals", getNewArrivals);
router.get("/top-deals", getTopDeals);
router.get("/top-brands", getTopBrands);
router.get("/top-categories", getTopCats);
router.get("/top-vendors", getTopVendors);
router.get("/get-product/:id", getProduct);
router.get("/vendor-products/:id", userGetVendorProducts);
router.get("/filter-products", productQuery);
router.get("/search", productSearch);
router.get("/vendor-products", authenticateVendor, getVendorProducts);

//DELETE ROUTE
router.delete("/delete-product/:id", authenticateVendor, deleteProduct);

//PUT ROUTE
router.put("/update-product/:id", authenticateVendor, updateProduct);
router.put("/review-product/:id", authenticateUser, review);


//EXPORT ROUTE
module.exports = router;