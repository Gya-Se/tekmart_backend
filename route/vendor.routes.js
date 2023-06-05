//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    createVendor, 
    vendorLogin,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    updateVendor,
    handleRefreshToken,
    logout,
    deleteVendor,
    saveAndUpdateAddress, } = require("../controller/vendor.controller");
const { 
    createProduct,
    deleteProductById, } = require("../controller/product.controller");
const {authenticateVendor} = require("../middlewares/authMiddleware");
const router = express.Router();

//POST ROUTE
router.post("/create-product", authenticateVendor, createProduct);

router.post("/register", createVendor);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/login", vendorLogin);


//GET ROUTE
router.get("/refresh", handleRefreshToken); 
router.get("/logout", logout); 

//DELETE ROUTE
router.delete("/delete-user", authenticateVendor, deleteVendor); 

router.delete("/delete-product", authenticateVendor, deleteProductById); 

//PUT ROUTE
router.put("/reset-password/:token", authenticateVendor, resetPassword);
router.put("/update-password", authenticateVendor, updatePassword);
router.put("/update-address", authenticateVendor, saveAndUpdateAddress);
router.put("/update-user", authenticateVendor, updateVendor); 

//EXPORT ROUTE
module.exports = router;



// //IMPORTING METHODS FROM DIRECTORIES TO ROUTE
// const express = require("express");

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