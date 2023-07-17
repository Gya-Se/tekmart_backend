const Cart = require("../models/cart.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { quantity } = req.body;
  const { productId } = req.params.id;
  validateMongoDbId(userId);
  validateMongoDbId(productId);
  try {
    let cart = await Cart.findOne({ user: userId });

    // Create new cart if it doesn't exist
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    // Check if the product already exists in the cart
    const existingProduct = cart.products.find(
      (product) => product.product.toString() === productId
    );

    // Update the quantity if the product already exists
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      // Add new product to the cart
      cart.products.push({ productId, quantity });
    }
    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update product quantity in cart
const updateCartProductQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params.id;
  const userId = req.user._id;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(400).send("Cart not found");
    }
    // Find the product in the cart and update its quantity
    const product = cart.products.find((product) => product.product.toString() === productId);
    if (!product) {
      return res.status(400).send("Product not found in cart");
    }
    product.quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Remove product from cart
const removeCartProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params._id;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(400).send("Cart not found");
    }
    // Find the item in the cart and remove it
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(400).send("Item not found in cart" );
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//User get cart
const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongoDbId(userId);
  try {
    const cart = await Cart.findOne({ user: userId }).populate("products.product");

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//User empty cart
const emptyCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongoDbId(userId);
  try {
    const cart = await Cart.findOneAndRemove({ user: userId });

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = {
  addToCart,
  updateCartProductQuantity,
  removeCartProduct,
  getUserCart,
  emptyCart,
}