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
    updateAvatar,
    activateVendor,
    getVendor, } = require("../controller/vendor.controller");
const { authenticateVendor } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multer");
const router = express.Router();

//POST ROUTE
router.post("/register", createVendor);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/activation/:token", activateVendor);
router.post("/login", vendorLogin);


//GET ROUTE
router.get("/refresh", handleRefreshToken); 
router.get("/get-vendor", authenticateVendor, getVendor); 
router.get("/logout", logout); 

//PUT ROUTE
router.put("/reset-password/:token", authenticateVendor, resetPassword);
router.put("/update-password", authenticateVendor, updatePassword);
router.put("/update-avatar", authenticateVendor,   upload.single("image"), updateAvatar);
router.put("/update-vendor", authenticateVendor, updateVendor); 

//DELETE ROUTE
router.delete("/delete-vendor", authenticateVendor, deleteVendor); 


//EXPORT ROUTE
module.exports = router;