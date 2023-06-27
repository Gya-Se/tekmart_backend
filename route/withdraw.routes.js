const express = require("express");
const {
    createWithdrawal,
    getAllWithdrawals,
    getaWithdrawal,
    updatePaymentMethod,
    deletePaymentMethod,} = require("../controller/withdraw.controller");
const { authenticateVendor } = require("../middlewares/authMiddleware");
const router = express.Router();

//Post route
router.post("/request", authenticateVendor, createWithdrawal);

//Get route
router.get("/:id", authenticateVendor, getaWithdrawal);
router.get("/", authenticateVendor, getAllWithdrawals);

//Put route
router.put("/update-payment-method", authenticateVendor, updatePaymentMethod);

//Delete route
router.delete("/delete-payment-method", authenticateVendor, deletePaymentMethod);

//Export route
module.exports = router;