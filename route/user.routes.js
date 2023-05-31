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
const {authenticateUser} = require("../middlewares/authMiddleware");
const router = express.Router();

// //POST ROUTE
router.post("/register", createUser);
// router.post("/forgot-password-token", forgotPasswordToken);
// router.post("/login", userLogin);
// router.post("/cart", isUser, userCart);
// router.post("/cart/apply-coupon", isUser, applyCoupon);
// router.post("/cart/create-order", isUser, createOrder);

// //GET ROUTE
// router.get("/get-orders", isUser, getOrders);
// router.get("/refresh", handleRefreshToken); 
// router.get("/logout", logout); 
// router.get("/wishlist", isUser, getWishlist);
// router.get("/user-cart", isUser, getUserCart);

// //DELETE ROUTE
// router.delete("/empty-cart", isUser, emptyCart);
// router.delete("/delete-user", isUser, emptyCart);

// //PUT ROUTE
// router.put("/reset-password/:token", isUser, resetPassword);
// router.put("/update-password", isUser, updatePassword);
// router.put("/update-user", isUser, updateaUser); 
// router.put("/save-address", isUser, saveAddress); 

// //EXPORT ROUTE
// module.exports = router;