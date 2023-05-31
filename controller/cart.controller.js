const Cart = require('../models/Cart');
const asyncHandler = require("express-async-handler");

// Get cart by user ID
const getCartByUserId = asyncHandler(
    async (req, res) => {
        try {
          const userId = req.params.userId;
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
const addToCart = async (req, res) => {
  try {
    const { user, product, quantity } = req.body;
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
};

// Update item quantity in cart
const updateCartItemQuantity = async (req, res) => {
  try {
    const { user, product, quantity } = req.body;
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
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const { user, product } = req.body;
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
};

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItemQuantity,
  removeCartItem
};