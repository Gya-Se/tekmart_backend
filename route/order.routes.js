const express = require("express");
const {
    createAnOrder,
    vendorGetOrderId,
    updateOrderStatus,
    getOrderId,
    userGetAllOrders,
    vendorGetAllOrders,
    acceptRefundRequest,
    refundRequest, } = require("../controller/order.controller");
const { authenticateUser, authenticateVendor } = require("../middlewares/authMiddleware");
const router = express.Router();

//Post route
router.post("/create-order", authenticateUser, createAnOrder);

//Get route
router.get("/user-order/:id", authenticateUser, getOrderId);
router.get("/user-orders", authenticateUser, userGetAllOrders);
router.get("/vendor-order/:id", authenticateVendor, vendorGetOrderId);
router.get("/vendor-orders", authenticateVendor, vendorGetAllOrders);

//Put route
router.put("/refund-request/:id", authenticateUser, refundRequest);
router.put("/update-order/:id", authenticateVendor, updateOrderStatus);
router.put("/refund/:id", authenticateVendor, acceptRefundRequest);

//Delete route


//Export route
module.exports = router;