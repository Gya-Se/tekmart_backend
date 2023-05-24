//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    createUser, 
    userLogin,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    updateaUser,
    handleRefreshToken,
    logout,
    saveAddress,
    getWishlist,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,} = require("../controller/user.controller");
const {authMiddleware} = require("../middlewares/authMiddleware");
const router = express.Router();

//POST ROUTE
router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/login", userLogin);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/create-order", authMiddleware, createOrder);

//GET ROUTE
router.get("/get-orders", authMiddleware, getOrders);
router.get("/refresh", handleRefreshToken); 
router.get("/logout", logout); 
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/user-cart", authMiddleware, getUserCart);

//DELETE ROUTE
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/delete-user", authMiddleware, emptyCart);

//PUT ROUTE
router.put("/reset-password/:token", authMiddleware, resetPassword);
router.put("/update-password", authMiddleware, updatePassword);
router.put("/update-user", authMiddleware, updateaUser); 
router.put("/save-address", authMiddleware, saveAddress); 

//EXPORT ROUTE
module.exports = router;