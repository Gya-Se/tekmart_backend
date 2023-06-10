const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


// Get cart by user ID
const getCartByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    validateMongoDbId(userId);
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Add item to cart
  const addToCart = asyncHandler(async (req, res) => {
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
      const existingItem = cart.items.find(
        (item) => item.product.toString() === product
      );
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
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Update item quantity in cart
  const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { user, product, quantity } = req.body;
    try {
      const cart = await Cart.findOne({ user });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      // Find the item in the cart and update its quantity
      const item = cart.items.find((item) => item.product.toString() === product);
      if (!item) {
        return res.status(404).json({ error: "Item not found in cart" });
      }
      item.quantity = quantity;
      await cart.save();
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Remove item from cart
  const removeCartItem = asyncHandler(async (req, res) => {
    const { user, product } = req.body;
    try {
      const cart = await Cart.findOne({ user });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      // Find the item in the cart and remove it
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product
      );
      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found in cart" });
      }
      cart.items.splice(itemIndex, 1);
      await cart.save();
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  //USER CART
  const userCart = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { cart } = req.body;
    validateMongoDbId(id);
    try {
      let products = [];
      const user = await User.findById(id);
      const alreadyInCart = await Cart.findOne({ orderby: user.id });
      if (alreadyInCart) {
        alreadyInCart.remove();
      }
      for (let i = 0; i < cart.length; i++) {
        let object = {};
        object.product = cart[i].id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        let getPrice = await Product.findById(cart[i].id).select("price").exec();
        object.price = getPrice.price;
        products.push(object);
      }
      let cartTotal = 0;
      for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price + products[i].count;
      }
      let newCart = await new Cart({
        products,
        cartTotal,
        orderby: user?.id,
      }).save();
      res.json(newCart);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //GET USER CART
  const getUserCart = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
      const cart = await Cart.findOne({ orderby: id }).populate(
        "products.product"
      );
      res.json(cart);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //USER EMPTY CART
  const emptyCart = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
      const user = await User.findOne({ id });
      const cart = await Cart.findOneAndRemove({ orderby: user.id });
      res.json(cart);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  userCart,
  getUserCart,
  emptyCart,
  }