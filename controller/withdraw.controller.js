// const Vendor = require('../models/vendor.model');
const Withdraw = require('../models/withdraw.model');
const Vendor = require('../models/vendor.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


// Create or request for a withdrawal
const createWithdrawal = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  const { shopName, email } = req.vendor;
  const { amount } = req.body;
  validateMongoDbId(vendorId);
  try {

    // Create new withdrawal
    const newWithdrawal = new Withdraw({ vendor, amount });
    await newWithdrawal.save();

    try {
      await sendMail({
        email: email,
        subject: "Withdraw Request",
        message: `Hello ${shopName}, Your withdraw request of GHC${amount}$ is processing. It will take 3days to 7days to processing! `,
      });
      res.status(201).json({
        success: true,
      });
    } catch (error) {
      throw new Error(error);
    }

    const vendor = await Vendor.findById(vendorId);
    if (vendor.availableBalance === 0) {
      throw new Error("You don't have money in your account")
    } else {
      vendor.availableBalance = vendor.availableBalance - amount;
      await vendor.save();
    }
    res.json(newWithdrawal);

  } catch (error) {
    throw new Error(error);
  }
});

// Get all wthdrawals of a vendor
const getAllWithdrawals = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  validateMongoDbId(vendorId);
  try {
    const allWithdrawals = await Withdraw.find({ vendor: vendorId }).sort({ createdAt: -1 });
    if (!allWithdrawals) {
      return res.status(404).json({ error: "You don't have any withdrawals yet" });
    }
    res.json(allWithdrawals);
  } catch (error) {
    throw new Error(error);
  }
});

// Get withdrawal of a vendor
const getaWithdrawal = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  const withdrawId = req.params.id;
  validateMongoDbId(vendorId);
  try {
    const withdraw = await Withdraw.findOne({ withdrawId });
    const checkVendor = withdraw.vendor.toString();

    if (checkVendor !== vendorId) throw new Error("Not Authorised");

    if (checkVendor === vendorId) {
      const getWithdrawal = await Withdraw.find({ withdrawId });
      if (!getWithdrawal) {
        return res.status(404).json({ error: "You don't have any withdrawals yet" });
      }
      res.json(getWithdrawal);
    };
  } catch (error) {
    throw new Error(error);
  }
});

// Update withdrawal method of a vendor
const updatePaymentMethod = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  validateMongoDbId(vendorId);
  const { withdrawMethod } = req.body;
  try {
    const vendor = await Vendor.findByIdAndUpdate(vendorId, { withdrawMethod }, { new: true });
    res.status(200).json(vendor);
  } catch (error) {
    throw new Error(error);
  }
});


// Delete payment method of a vendor
const deletePaymentMethod = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  validateMongoDbId(vendorId);
  try {
    const vendor = await Vendor.findById(req.seller._id);

    if (!vendor) {
      return new Error("Vendor not found");
    }
    vendor.withdrawMethod = null;
    await vendor.save();

  } catch (error) {
    throw new Error(error);
  }
});


module.exports = {
  createWithdrawal,
  getAllWithdrawals,
  getaWithdrawal,
  updatePaymentMethod,
  deletePaymentMethod,
}