//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    deleteVendorById,
    deleteUserById,
    getAllUsers,
    getAllVendors,
    getUserById,
    getVendorById, } = require("../controller/admin.controller");
const { authenticateAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

//POST ROUTE

//GET ROUTE
router.get("/get-user/:id", authenticateAdmin, getUserById); 
router.get("/get-all-users", authenticateAdmin, getAllUsers); 

router.get("/get-vendor/:id", authenticateAdmin, getVendorById); 
router.get("/get-all-vendors",authenticateAdmin, getAllVendors); 

//PUT ROUTE
// router.post("/block-user",  authenticateAdmin, blockUser);

//DELETE ROUTE
router.delete("/delete-user/:id", authenticateAdmin, deleteUserById);

router.delete("/delete-vendor/:id", authenticateAdmin, deleteVendorById);

//EXPORT ROUTE
module.exports = router;