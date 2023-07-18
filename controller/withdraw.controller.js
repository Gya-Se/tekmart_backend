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

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(400).send(error);
    }

    const vendor = await Vendor.findById(vendorId);
    if (vendor.availableBalance === 0) {
      return res.status(400).send("You don't have money in your account")
    } else {
      vendor.availableBalance = vendor.availableBalance - amount;
      await vendor.save();
    }

    res.status(200).json({
      success: true,
      data: newWithdrawal
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all wthdrawals of a vendor
const getAllWithdrawals = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  validateMongoDbId(vendorId);
  try {
    const allWithdrawals = await Withdraw.find({ vendor: vendorId }).sort({ createdAt: -1 });
    if (!allWithdrawals) {
      return res.status(400).send("You don't have any withdrawals yet");
    }

    res.status(200).json({
      success: true,
      data: allWithdrawals
    });
  } catch (error) {
    res.status(400).send(error);
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

    if (checkVendor !== vendorId) res.status(400).send("Not Authorised");

    if (checkVendor === vendorId) {
      const getWithdrawal = await Withdraw.find({ withdrawId });
      if (!getWithdrawal) {
        return res.status(400).send("You don't have any withdrawals yet");
      }

      res.status(200).json({
        success: true,
        data: getWithdrawal
      });
    };
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update withdrawal method of a vendor
const updatePaymentMethod = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  validateMongoDbId(vendorId);
  const { withdrawMethod } = req.body;
  try {
    const vendor = await Vendor.findByIdAndUpdate(vendorId, { withdrawMethod }, { new: true });

    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(400).send(error);
  }
});


// Delete payment method of a vendor
const deletePaymentMethod = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  validateMongoDbId(vendorId);
  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(400).send("Vendor not found");
    }
    vendor.withdrawMethod = null;
    await vendor.save();

    res.status(200).json({
      success: true,
      message: "Payment method deleted successfully"
    });
  } catch (error) {
    res.status(400).send(error);
  }
});


module.exports = {
  createWithdrawal,
  getAllWithdrawals,
  getaWithdrawal,
  updatePaymentMethod,
  deletePaymentMethod,
}