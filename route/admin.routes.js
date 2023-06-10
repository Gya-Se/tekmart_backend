//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    deleteVendorById,
    deleteUserById,
    getAllUsers,
    getAllVendors,
    getUserById,
    getVendorById, } = require("../controller/admin.controller");
const { isAdmin, authenticateUser } = require("../middlewares/authMiddleware");
const router = express.Router();

//POST ROUTE

//GET ROUTE
router.get("/get-user/:id", authenticateUser, isAdmin, getUserById);
router.get("/get-all-users", authenticateUser, isAdmin, getAllUsers);

router.get("/get-vendor/:id", authenticateUser, isAdmin, getVendorById);
router.get("/get-all-vendors", authenticateUser, isAdmin, getAllVendors);

//PUT ROUTE
// router.post("/block-user",  authenticateUser, isAdmin, blockUser);

//DELETE ROUTE
router.delete("/delete-user/:id", authenticateUser, isAdmin, deleteUserById);

router.delete("/delete-vendor/:id", authenticateUser, isAdmin, deleteVendorById);

//EXPORT ROUTE
module.exports = router;