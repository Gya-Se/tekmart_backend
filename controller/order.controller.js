const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


//Create order
const createAnOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { deliveryAddress, totalPrice, paymentInfo } = req.body;
  validateMongoDbId(userId);
  try {
    const userCart = await Cart.findOne({ user: userId });

    //   group cart items by vendorId
    const vendorItemsMap = new Map();

    for (const item of userCart) {
      const vendor = item.vendor;
      if (!shopItemsMap.has(vendor)) {
        shopItemsMap.set(vendor, []);
      }
      shopItemsMap.get(vendor).push(item);
    }

    // create an order for each shop
    const orders = [];

    for (const [vendor, items] of shopItemsMap) {
      const order = await Order.create({
        cart: items,
        deliveryAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }
    res.status(200).json(orders);
  } catch (error) {
    throw new Error(error);
  }
});

//Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;
  validateMongoDbId(orderId);
  try {
    const order = await Order.findById(orderId);

    if (!order) throw new Error("Order not found with this id");

    if (status === "Handed over for delivery") {
      order.products.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });
    }

    order.status = status;

    if (status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
      const serviceCharge = order.totalPrice * .10;
      await updateSellerInfo(order.totalPrice - serviceCharge);
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json(order);

    async function updateOrder(id, qty) {
      const product = await Product.findById(id);
      product.stock -= qty;
      product.sold_out += qty;
      await product.save({ validateBeforeSave: false });
    }

    async function updateSellerInfo(amount) {
      const vendor = await Shop.findById(req.seller.id);
      vendor.availableBalance = amount;
      await vendor.save();
    }
  } catch (error) {
    throw new Error(error);
  }
});

//User get order by Id
const getOrderId = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongoDbId(userId);
  try {
    const userOrder = await Order.findOne({ "user._id": userId }).populate("products.product").exec();
    res.status(200).json(userOrder);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all orders of a user
const userGetAllOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongoDbId(userId);
  try {
    const orders = await Order.find({ "user._id": userId }).sort({ createdAt: -1, });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Vendor get order by Id
const vendorGetOrderId = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  validateMongoDbId(vendorId);
  try {
    const vendorOrder = await Order.findOne({ "products.vendor": vendorId }).populate("products.product").exec();
    res.status(200).json(vendorOrder);
  } catch (error) {
    throw new Error(error);
  }
});

// Vendor get orders
const vendorGetAllOrders = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  validateMongoDbId(vendorId);
  try {
    const orders = await Order.find({ "products.vendor": vendorId }).sort({ createdAt: -1, });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//User get order by Id
const refundRequest = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  validateMongoDbId(orderId);
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.status = req.body.status;
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      order,
      message: "Order Refund Request successfully!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Vendor accept the refund
const acceptRefundRequest = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  validateMongoDbId(orderId);
  try {
    const order = await Order.findById(orderId);

    if (!order) throw new Error("Order not found")

    order.status = status;

    await order.save();

    res.status(200).json("Order Refund successfull!");

    //look into this
    if (status === "Refund Success") {
      order.products.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });
    }

    async function updateOrder(id, qty) {
      const product = await Product.findById(id);

      product.quantity += qty;
      product.sold -= qty;

      await product.save({ validateBeforeSave: false });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createAnOrder,
  vendorGetOrderId,
  updateOrderStatus,
  getOrderId,
  userGetAllOrders,
  vendorGetAllOrders,
  acceptRefundRequest,
  refundRequest,
};