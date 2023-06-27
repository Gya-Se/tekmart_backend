const express = require("express");
const {
    // createTransaction,
    getUserTransactions,
    getUserTransactionById, } = require("../controller/transaction.controller");
const { authenticateUser } = require("../middlewares/authMiddleware");
const router = express.Router();

//Post route
// router.post("/add-to-cart/:id", authenticateUser, addToCart);

//Get route
router.get("/", authenticateUser, getUserTransactions);
router.get("/:id", authenticateUser, getUserTransactionById);

//Put route

//Delete route

//Export route
module.exports = router;