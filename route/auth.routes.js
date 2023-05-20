const express = require("express");
const { createUser, 
    loginCtrl, 
    getAllUsers, 
    getaUser, 
    deleteaUser, 
    updateaUser, 
    unBlockUser, 
    blockUser, 
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    saveAddress,
    getWishlist,
    resetPassword,
    adminLogin,
    userCart,
    getUserCart,
    emptyCart, } = require("../controller/user.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginCtrl);
router.post("/admin-login", adminLogin);
router.post("/cart", authMiddleware, userCart);
router.get("/getallusers", getAllUsers);
router.get("/refresh", handleRefreshToken); 
router.get("/logout", logout); 
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteaUser);

router.put("/edit", authMiddleware, updateaUser); 
router.put("/save-address", authMiddleware, saveAddress); 
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser); 
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser); 



module.exports = router;