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
    const {shippingAddress, paymentIntent, products, totalAmount, userId } = req.body;
    // Create new order
    const newOrder = new Order({ shippingAddress, paymentIntent, products, totalAmount, user: userId });
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
  const userId = req.body.userId;
  validateMongoDbId(userId);
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

//UPDATE ORDER STATUS
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status} = req.body;
  const { id } = req.user;
  validateMongoDbId(id);
  try {
      const updateOrdStatus = await Order.findByIdAndUpdate(
          id,
          {
              orderStatus: status,
              paymentIntent: {
                  status: status,
              },
          }, {
              new: true,
          },
     )
      res.json(updateOrdStatus);
  } catch (error) {
      throw new Error(error);
  }
});


//CREATE ORDER
const createAnOrder = asyncHandler(async (req, res) => {
    const { cashOnDel, couponApplied } = req.body;
    const { id } = req.user;
    validateMongoDbId(id);
    try {
        if (!cashOnDel) throw new Error("Creating Cash on Delivery Failed");
        const user = await User.findById(id);
        const userCart = await Cart.findOne({ orderby: user.id });
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        }
        else {
            finalAmount = userCart.cartTotal;
        }
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "cashOnDel",
                amount: finalAmount,
                status: "Cash On Delivery",
                created: Date.now(),
                currency: "GHC",
            },
            orderby: user.id,
            orderStatus: "Processing",
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { id: item.product.id },
                    update: { $inc: { quantity: -item.count, sold: + item.count } },
                },
            };
        });
        const updated = Product.bulkWrite(update, {});
        res.json({ message: "success" });
    } catch (error) {
        throw new Error(error);
    }
});

//User get orders
const getOrders = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
        const userOrders = await Order.findOne({ orderby: id }).populate("products.product").exec();
        res.json(userOrders);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById
};