// const Vendor = require('../models/vendor.model');
const Withdraw = require('../models/withdraw.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


// Create or request for a withdrawal
const createWithdrawal = asyncHandler(async (req, res) => {
    const vendor = req.user.id;
    const { amount } = req.body;
    validateMongoDbId(vendor);
    try {
        // Create new withdrawal
        const newWithdrawal = new Withdraw({ vendor, amount });
        await newWithdrawal.save();

        // const data = {
        //   to: "sethgyan587@gmail.com",
        //   text: "Vendor Fund Request",
        //   subject: `Vendor with ID ${vendor} has requested for a withdrawal amount of ${amount}`,
        // };
        // sendEmail(data);

        res.json(newWithdrawal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all wthdrawals of a vendor
const getWithdrawals = asyncHandler(async (req, res) => {
    const vendor = req.user.id;
    validateMongoDbId(vendor);
    try {
        const allWithdrawals = await Withdraw.find({ vendor: vendor });
        if (!allWithdrawals) {
            return res.status(404).json({ error: "You don't have any withdrawals yet" });
        }
        res.json(allWithdrawals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Vendor cancel withdrawal request
const cancelWithdrawal = asyncHandler(async (req, res) => {
    const vendor = req.user.id;
    const { withdrawId, cancel } = req.body;
    validateMongoDbId(vendor);
    validateMongoDbId(withdrawId);
    try {
        const withdrawal = await Withdraw.findByIdAndUpdate(withdrawId, cancel, { new: true });
        res.status(200).json(withdrawal)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Vendor delete a withdrawal
const deleteWithdrawal = asyncHandler(async (req, res) => {
    validateMongoDbId();
    try {
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = {
    createWithdrawal,
    cancelWithdrawal,
    getWithdrawals,
    deleteWithdrawal,
}