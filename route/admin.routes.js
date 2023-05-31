// //IMPORTING METHODS FROM DIRECTORIES TO ROUTE
// const express = require("express");
// const { isSeller } = require("../middlewares/authMiddleware");
// const {
//     createCoupon,
//     getaCoupon,
//     updateCoupon,
//     deleteCoupon,
//     getAllCoupons } = require("../controller/coupon.controller");
// const router = express.Router();

// //POST ROUTE
// router.post("/create-coupon",  isSeller, createCoupon);

// //GET ROUTE
// router.get("/get-all-coupons", isSeller, getAllCoupons);
// router.get("/get-coupon/:id",  isSeller, getaCoupon);

// //PUT ROUTE
// router.put("/update-coupon/:id",  isSeller, updateCoupon);

// //DELETE ROUTE
// router.delete("/delete-coupon/:id", isSeller, deleteCoupon);

// //EXPORT ROUTE
// module.exports = router;