// //IMPORTING METHODS FROM DIRECTORIES TO ROUTE
// const express = require("express");
// const {
//     createSeller, 
//     handleRefreshToken,
//     logout,
//     deleteAseller,
//     updatePassword,
//     forgotPasswordToken,
//     resetPassword,
//     sellerLogin,
//     saveAddress,
//     getOrders,
//     updateOrderStatus,
//     updateAseller } = require("../controller/seller.controller");
// const {isSeller, } = require("../middlewares/authMiddleware");
// const router = express.Router();

// //POST ROUTE
// router.post("/register", createSeller);
// router.post("/forgot-password-token", forgotPasswordToken);
// router.post("/login", sellerLogin);

// //GET ROUTE
// router.get("/get-orders", isSeller, getOrders);
// router.get("/refresh", handleRefreshToken); 
// router.get("/logout", logout); 

// //DELETE ROUTE
// router.put("/delete/:id", isSeller, deleteAseller);


// //PUT ROUTE
// router.put("/reset-password/:token", isSeller, resetPassword);
// router.put("/update-order/:id", isSeller, updateOrderStatus);
// router.put("/update-password", isSeller, updatePassword);
// router.put("/update-seller", isSeller, updateAseller); 
// router.put("/save-address", isSeller, saveAddress); 

// //EXPORT ROUTE
// module.exports = router;