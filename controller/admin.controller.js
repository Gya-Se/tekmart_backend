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
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
});

//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const user = await User.find().sort({ createdAt: -1 });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
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

      res.json('User blocked successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
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
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
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
    res.json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
});

//Get all vendors
const getAllVendors = asyncHandler(async (req, res) => {
  try {
    const vendor = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
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

      res.json('Vendor blocked successfully');
    }

  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
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
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
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
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
});

//Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find().sort({ createdAt: -1 });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
});

// Block user account
const blockAndUnblockProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  validateMongoDbId(productId);
  try {
    let blockedProduct;
    const product = await Product.findById(productId);
    const vendorId = product.vendor.toString();

    const vendor = await Vendor.findById(vendorId);

    if (!product) {
      return res.status(404).json('Product not found');
    }

    if (product.isBlocked === true) {
      blockedProduct = await Product.findByIdAndUpdate(productId, { isBlocked: false }, { new: true });

      try {
        sendEmail({
          email: vendor.email,
          subject: "Your product is unblocked",
          message: `Hello ${vendor.shopName}, Your product with name ${product.name} and description "${product.description}" is unblocked. Kindly follow our rules to prevent your product from being blocked again.`,
        });
      } catch (error) {
        throw new Error(error);
      }

      res.json('Product unblocked successfully');
    }
    else {
      blockedProduct = await Product.findByIdAndUpdate(productId, { isBlocked: true }, { new: true });

      try {
        sendEmail({
          email: vendor.email,
          subject: "Your product is blocked",
          message: `Hello ${vendor.shopName}, Your product with name ${product.name} and description "${product.description}" is blocked since it doesn't follow our rules.`,
        });
      } catch (error) {
        throw new Error(error);
      }
      res.json('Product blocked successfully');
    }

  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
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
    res.json('User deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
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
    res.status(201).json(withdraws);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
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
    res.status(201).json(withdraw);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
});




//****************  ORDER ********************************/

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
    res.json('Order blocked successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
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
  blockAndUnblockProduct,

  allWithdrawals,
  vendorWithdrew,

  updateOrderStatus,
};