//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    authMiddleware,
    isAdmin } = require("../middlewares/authMiddleware");
const {
    createCoupon,
    getaCoupon,
    updateCoupon,
    deleteCoupon,
    getAllCoupons } = require("../controller/coupon.controller");
const router = express.Router();

//POST ROUTE
router.post("/create-coupon", authMiddleware, isAdmin, createCoupon);

//GET ROUTE
router.get("/get-all-coupons", authMiddleware, isAdmin, getAllCoupons);
router.get("/get-coupon/:id", authMiddleware, isAdmin, getaCoupon);

//PUT ROUTE
router.put("/update-coupon/:id", authMiddleware, isAdmin, updateCoupon);

//DELETE ROUTE
router.delete("/delete-coupon/:id", authMiddleware, isAdmin, deleteCoupon);

//EXPORT ROUTE
module.exports = router;