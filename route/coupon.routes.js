const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCoupon, getaCoupon, updateCoupon, deleteCoupon, getAllCoupons } = require("../controller/coupon.controller");
const router = express.Router();


router.post("/create-coupon", authMiddleware, isAdmin, createCoupon);
router.get("/get-coupon/:id", getaCoupon);
router.put("/update-coupon/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/delete-coupon/:id", authMiddleware, isAdmin, deleteCoupon);
router.get("/get-all-coupons", getAllCoupons);



module.exports = router;