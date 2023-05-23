//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    authMiddleware,
    isSeller } = require("../middlewares/authMiddleware");
const {
    createCoupon,
    getaCoupon,
    updateCoupon,
    deleteCoupon,
    getAllCoupons } = require("../controller/coupon.controller");
const router = express.Router();

//POST ROUTE
router.post("/create-coupon", authMiddleware, isSeller, createCoupon);

//GET ROUTE
router.get("/get-all-coupons", authMiddleware, isSeller, getAllCoupons);
router.get("/get-coupon/:id", authMiddleware, isSeller, getaCoupon);

//PUT ROUTE
router.put("/update-coupon/:id", authMiddleware, isSeller, updateCoupon);

//DELETE ROUTE
router.delete("/delete-coupon/:id", authMiddleware, isSeller, deleteCoupon);

//EXPORT ROUTE
module.exports = router;