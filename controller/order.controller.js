const Order = require('../models/order.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Get all orders
const getAllOrders = asyncHandler (async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get order by ID
const getOrderById = asyncHandler (async (req, res) => {
  const orderId = req.params.id;
  validateMongoDbId(orderId);
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new order
const createOrder = asyncHandler (async (req, res) => {
  try {
    const { products, total, user } = req.body;
    // Create new order
    const newOrder = new Order({ products, total, user });
    await newOrder.save();
    res.json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order by ID
const updateOrderById = asyncHandler (async (req, res) => {
  const orderId = req.params.id;
  validateMongoDbId(orderId);
  try {
    const updates = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete order by ID
const deleteOrderById = asyncHandler (async (req, res) => {
  const orderId = req.params.id;
  validateMongoDbId(orderId);
  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById
};