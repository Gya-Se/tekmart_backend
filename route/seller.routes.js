//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    createSeller, 
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    sellerLogin,
    saveAddress,
    getOrders,
    updateOrderStatus,
    updateAseller } = require("../controller/seller.controller");
const {
    authMiddleware,
    isSeller, } = require("../middlewares/authMiddleware");
const router = express.Router();

//POST ROUTE
router.post("/register", createSeller);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/seller-login", sellerLogin);

//GET ROUTE
router.get("/get-orders", authMiddleware, isSeller, getOrders);
router.get("/refresh", handleRefreshToken); 
router.get("/logout", logout); 

//DELETE ROUTE

//PUT ROUTE
router.put("/reset-password/:token", authMiddleware, isSeller, resetPassword);
router.put("/update-order/:id",authMiddleware, isSeller, updateOrderStatus);
router.put("/password", authMiddleware, isSeller, updatePassword);
router.put("/edit", authMiddleware, isSeller, updateAseller); 
router.put("/save-address", authMiddleware, isSeller, saveAddress); 

//EXPORT ROUTE
module.exports = router;