const express = require("express");
const {
    createBrand,
    getaBrand,
    getAllBrand,
    updateBrand,
    deleteBrand, } = require("../controller/brand.controller");
const {
    authMiddleware,
    isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();


//POST ROUTE
router.post("/create-brand", authMiddleware, isAdmin, createBrand);

//GET ROUTE
router.get("/get-all-brands", getAllBrand);
router.get("/get-brand/:id", getaBrand);

//PUT ROUTE
router.put("/update-brand/:id", authMiddleware, isAdmin, updateBrand);

//DELETE ROUTE
router.delete("/delete-brand/:id", authMiddleware, isAdmin, deleteBrand);

//EXPORT ROUTE
module.exports = router;