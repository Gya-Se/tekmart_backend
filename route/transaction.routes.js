const express = require("express");
const {
    // createTransaction,
    getUserTransactions,
    getUserTransactions, } = require("../controller/transaction.controller");
const { authenticateUser } = require("../middlewares/authMiddleware");
const router = express.Router();

//Post route
// router.post("/add-to-cart/:id", authenticateUser, addToCart);

//Get route
router.get("/", authenticateUser, getUserTransactions);
router.get("/:id", authenticateUser, getUserTransactions);

//Put route

//Delete route

//Export route
module.exports = router;