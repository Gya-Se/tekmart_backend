//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    deleteVendor,
    deleteUser,
    getAllUsers,
    getAllVendors,
    getUser,
    getVendor,
    blockAndUnblockUser,
    blockAndUnblockVendor,
    getAllProducts,
    getProduct,
    vendorWithdrew,
    updateOrderStatus,
    allWithdrawals,
    deleteProduct,
    getAllOrdersOfUser,
    getOrderById,
    getAllOrdersOfVendor,
    getAllOrders, } = require("../controller/admin.controller");
const { isAdmin, authenticateUser } = require("../middlewares/authMiddleware");
const router = express.Router();

//POST ROUTE

//GET ROUTE
router.get("/get-user/:id", authenticateUser, isAdmin, getUser);
router.get("/get-all-users", authenticateUser, isAdmin, getAllUsers);
router.get("/get-vendor/:id", authenticateUser, isAdmin, getVendor);
router.get("/get-all-vendors", authenticateUser, isAdmin, getAllVendors);
router.get("/get-product/:id", authenticateUser, isAdmin, getProduct);
router.get("/get-all-products", authenticateUser, isAdmin, getAllProducts);
router.get("/get-all-withdrawals", authenticateUser, isAdmin, allWithdrawals);
router.get("/get-order/:id", authenticateUser, isAdmin, getOrderById);
router.get("/get-all-orders:", authenticateUser, isAdmin, getAllOrders);
router.get("/get-all-orders-user/:id", authenticateUser, isAdmin, getAllOrdersOfUser);
router.get("/get-all-orders-vendor/:id", authenticateUser, isAdmin, getAllOrdersOfVendor);

//PUT ROUTE
router.put("/block-and-unblock-user/:id",  authenticateUser, isAdmin, blockAndUnblockUser);
router.put("/block-and-unblock-vendor/:id",  authenticateUser, isAdmin, blockAndUnblockVendor);
router.put("/update-vendor-withdrawal/:id",  authenticateUser, isAdmin, vendorWithdrew);
router.put("/update-order/:id",  authenticateUser, isAdmin, updateOrderStatus);

//DELETE ROUTE
router.delete("/delete-user/:id", authenticateUser, isAdmin, deleteUser);
router.delete("/delete-product/:id", authenticateUser, isAdmin, deleteProduct);
router.delete("/delete-vendor/:id", authenticateUser, isAdmin, deleteVendor);

//EXPORT ROUTE
module.exports = router;