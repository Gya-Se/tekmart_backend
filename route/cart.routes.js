const express = require("express");
const {
    addToCart,
    updateCartProductQuantity,
    removeCartProduct,
    getUserCart,
    emptyCart,} = require("../controller/cart.controller");
const { authenticateUser } = require("../middlewares/authMiddleware");
const router = express.Router();

//Post route
router.post("/add-to-cart/:id", authenticateUser, addToCart);

//Get route
router.get("/user-cart", authenticateUser, getUserCart);

//Put route
router.put("/update-prod-qty/:id", authenticateUser, updateCartProductQuantity);
router.put("/remove-prod/:id", authenticateUser, removeCartProduct);

//Delete route
router.delete("/empty-cart", authenticateUser, emptyCart);

//Export route
module.exports = router;