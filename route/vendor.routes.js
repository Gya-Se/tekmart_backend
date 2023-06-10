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
const {authenticateVendor} = require("../middlewares/authMiddleware");
const router = express.Router();

//POST ROUTE
router.post("/register", createVendor);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/login", vendorLogin);


//GET ROUTE
router.get("/refresh", handleRefreshToken); 
router.get("/logout", logout); 

//DELETE ROUTE
router.delete("/delete-vendor", authenticateVendor, deleteVendor); 

//PUT ROUTE
router.put("/reset-password/:token", authenticateVendor, resetPassword);
router.put("/update-password", authenticateVendor, updatePassword);
router.put("/update-address", authenticateVendor, saveAndUpdateAddress);
router.put("/update-vendor", authenticateVendor, updateVendor); 

//EXPORT ROUTE
module.exports = router;