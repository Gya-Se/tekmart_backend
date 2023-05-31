const Cart = require('../models/cart.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Get cart by user ID
const getCartByUserId = asyncHandler( async (req, res) => {
  const userId = req.params.userId;
  validateMongoDbId(userId);
        try {
          const cart = await Cart.findOne({ user: userId });
          if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
          }
          res.json(cart);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Server error' });
        }
      }
);

// Add item to cart
const addToCart = asyncHandler (async (req, res) => {
  const { user, product, quantity } = req.body;
  // validateMongoDbId(user);
  // validateMongoDbId(product);
  try {
    let cart = await Cart.findOne({ user });
    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({ user, items: [] });
    }
    // Check if the item already exists in the cart
    const existingItem = cart.items.find((item) => item.product.toString() === product);
    if (existingItem) {
      // Update the quantity if the item already exists
      existingItem.quantity += quantity;
    } else {
      // Add new item to the cart
      cart.items.push({ product, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update item quantity in cart
const updateCartItemQuantity = asyncHandler (async (req, res) => {
  const { user, product, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    // Find the item in the cart and update its quantity
    const item = cart.items.find((item) => item.product.toString() === product);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from cart
const removeCartItem = asyncHandler (async (req, res) => {
  const { user, product } = req.body;
  try {
    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    // Find the item in the cart and remove it
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === product);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItemQuantity,
  removeCartItem
};