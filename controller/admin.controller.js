const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const Product = require('../models/product.model');
const Withdraw = require('../models/withdraw.model');
const Order = require('../models/order.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const sendEmail = require("./email.controller");

//****************  USER ********************************/

// Get user by ID
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongoDbId(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Block user account
const blockAndUnblockUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongoDbId(userId);
  try {
    let blockedUser;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json('User not found');
    }

    if (user.isBlocked === true) {
      blockedUser = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
      try {
        sendEmail({
          email: user.email,
          subject: "Account Unblocked",
          message: `Hello ${user.firstname}, Your account is unblocked. Kindly refrain from suspicious activities so as to not to get your acoount blocked again.`,
        });
      } catch (error) {
        throw new Error(error);
      }

      res.json('User unblocked successfully');
    } else {
      blockedUser = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });

      try {
        sendEmail({
          email: user.email,
          subject: "Account Blocked",
          message: `Hello ${user.firstname}, Your account is blocked because of suspicious activities involved with your account.`,
        });
      } catch (error) {
        throw new Error(error);
      }

      res.status(200).json({
        message: "User blocked successfully",
        success: true,
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete User account
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongoDbId(userId);
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json('User not found');
    }
    res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });

  } catch (error) {
    res.status(400).send(error);
  }
});


//****************  VENDOR ********************************/

// Get vendor by ID
const getVendor = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;
  validateMongoDbId(vendorId);
  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json('Vendor not found');
    }
    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Get all vendors
const getAllVendors = asyncHandler(async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Block vendor account
const blockAndUnblockVendor = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;
  validateMongoDbId(vendorId);
  try {
    let blockedVendor;
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json('Vendor not found');
    }

    if (vendor.isBlocked === true) {
      blockedVendor = await Vendor.findByIdAndUpdate(vendorId, { isBlocked: false }, { new: true });

      try {
        sendEmail({
          email: vendor.email,
          subject: "Account Unblocked",
          message: `Hello ${vendor.shopName}, Your account is unblocked. Kindly refrain from suspicious activities so as to not to get your acoount blocked again.`,
        });
      } catch (error) {
        throw new Error(error);
      }

      res.json('Vendor unblocked successfully');
    }
    else {
      blockedVendor = await Vendor.findByIdAndUpdate(vendorId, { isBlocked: true }, { new: true });

      try {
        sendEmail({
          email: vendor.email,
          subject: "Account Blocked",
          message: `Hello ${vendor.shopName}, Your account is blocked because of suspicious activities involved with your account.`,
        });
      } catch (error) {
        throw new Error(error);
      }

      res.status(200).json({
        message: "Vendor blocked successfully",
        success: true,
      });
    }

  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete vendor account
const deleteVendor = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;
  validateMongoDbId(vendorId);
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
    if (!deletedVendor) {
      return res.status(404).json('User not found');
    }
    res.status(200).json({
      message: "Vendor deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});


//****************  PRODUCT ********************************/

// Get product by ID
const getProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  validateMongoDbId(productId);
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json('Product not found');
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  validateMongoDbId(productId);
  try {
    const deletedVendor = await Product.findByIdAndDelete(productId);
    if (!deletedVendor) {
      return res.status(404).json('Product not found');
    }
    res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});


//****************  WITHDRAWS ********************************/

// Get all withdrawals
const allWithdrawals = asyncHandler(async (req, res) => {
  try {
    const withdraws = await Withdraw.find().sort({ createdAt: -1 });
    if (!withdraws) {
      return res.status(404).json('No withdrawals yet');
    }

    res.status(200).json({
      success: true,
      data: withdraws
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Mark vendor as paid [for vendors who has requested cashout
const vendorWithdrew = asyncHandler(async (req, res) => {
  const withdrawId = req.params.id;
  validateMongoDbId(withdrawId);
  try {
    const withdraw = await Withdraw.findByIdAndUpdate(withdrawId,
      { status: "succeed" }, { new: true }
    );
    const vendorId = withdraw.vendor.toString();
    const vendor = await Vendor.findById(vendorId)

    const transaction = {
      _id: withdraw._id,
      amount: withdraw.amount,
      status: withdraw.status,
    };

    seller.transactions = [...seller.transactions, transaction];

    await vendor.save();
    try {
      sendEmail({
        email: vendor.email,
        subject: "Payment confirmation",
        message: `Hello ${vendor.shopName}, Your withdraw request of ${withdraw.amount}$ is on the way. You should received it in the next 5 minutes.`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    res.status(200).json({
      success: true,
      data: withdraw
    });
  } catch (error) {
    res.status(400).send(error);
  }
});




//****************  ORDER ********************************/

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find().sort({
      deliveredAt: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all orders of a user
const getAllOrdersOfUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongoDbId(userId);
  try {
    const orders = await Order.find({ "user._id": userId }).sort({ createdAt: -1, });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all orders of a vendor
const getAllOrdersOfVendor = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;
  validateMongoDbId(vendorId);
  try {
    const orders = await Order.find({ "products.vendor": vendorId }).sort({ createdAt: -1, });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update user order status after payment
const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  validateMongoDbId(orderId);
  try {
    const updateStatus = await Order.findByIdAndUpdate(orderId,
      { status: "paid" }, { new: true });
    if (!updateStatus) {
      return res.status(404).json('Order not found');
    }

    res.status(200).json({
      message: "Order blocked successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  validateMongoDbId(orderId);
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).send(error);
  }
});


module.exports = {
  getUser,
  getAllUsers,
  deleteUser,
  blockAndUnblockUser,

  getAllVendors,
  getVendor,
  deleteVendor,
  blockAndUnblockVendor,

  getAllProducts,
  getProduct,
  deleteProduct,

  allWithdrawals,
  vendorWithdrew,

  updateOrderStatus,
  getAllOrders,
  getOrderById,
  getAllOrdersOfUser,
  getAllOrdersOfVendor
};