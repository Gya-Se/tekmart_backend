//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const {
    createUser, 
    userLogin,
    adminLogin,
    sellerLogin,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    getAllUsers,
    getaUser,
    deleteaUser,
    updateaUser,
    unBlockUser, 
    blockUser,
    handleRefreshToken,
    logout,
    saveAddress,
    getWishlist,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus, } = require("../controller/user.controller");
const {
    authMiddleware,
    isAdmin, } = require("../middlewares/authMiddleware");
const router = express.Router();

//POST ROUTE
router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
//Here
router.post("/user-login", userLogin);
router.post("/admin-login", adminLogin);
router.post("/seller-login", sellerLogin);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/create-order", authMiddleware, createOrder);

//GET ROUTE
router.get("/getallusers", authMiddleware, isAdmin, getAllUsers);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/refresh", handleRefreshToken); 
router.get("/logout", logout); 
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/:id", authMiddleware, isAdmin, getaUser);

//DELETE ROUTE
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", authMiddleware, isAdmin, deleteaUser);

//PUT ROUTE
//There
router.put("/reset-password/:token", authMiddleware, resetPassword);
router.put("/update-order/:id",authMiddleware, updateOrderStatus);
router.put("/password", authMiddleware, updatePassword);
//There
router.put("/edit", authMiddleware, updateaUser); 
router.put("/save-address", authMiddleware, saveAddress); 
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser); 
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser); 

//EXPORT ROUTE
module.exports = router;