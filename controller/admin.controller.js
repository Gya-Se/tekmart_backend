const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const Product = require('../models/product.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

//****************  USER ********************************/

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongoDbId(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const user = await User.find().sort({createdAt: -1});
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete User account
const deleteUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongoDbId(userId);
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user order status after payment
// const updateOrderStatus = asyncHandler(async (req, res) => {

// });




//****************  VENDOR ********************************/

// Get vendor by ID
const getVendorById = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;
  validateMongoDbId(vendorId);
  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Get all vendors
const getAllVendors = asyncHandler(async (req, res) => {
  try {
    const vendor = await Vendor.find().sort({createdAt: -1});
    res.json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete vendor account
const deleteVendorById = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;
  validateMongoDbId(vendorId);
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
    if (!deletedVendor) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark vendor as paid [for vendors who has requested cashout]
// const vendorPaid = asyncHandler(async (req, res) => {

// });





//****************  PRODUCT ********************************/

// Get product by ID
const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  validateMongoDbId(productId);
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find().sort({createdAt: -1});
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a product
const deleteProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  validateMongoDbId(productId);
  try {
    const deletedVendor = await Product.findByIdAndDelete(productId);
    if (!deletedVendor) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = {
  getUserById,
  getAllUsers,
  deleteUserById,
  // updateOrderStatus,

  getAllVendors,
  getVendorById,
  deleteVendorById,
  // vendorPaid,

  getAllProducts,
  getProductById,
  deleteProductById
};











// get all withdraws --- admnin

router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update withdraw request ---- admin
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sellerId } = req.body;

      const withdraw = await Withdraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "succeed",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      const seller = await Shop.findById(sellerId);

      const transection = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };

      seller.transections = [...seller.transections, transection];

      await seller.save();

      try {
        await sendMail({
          email: seller.email,
          subject: "Payment confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
