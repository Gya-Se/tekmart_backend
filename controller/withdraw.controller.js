// const Vendor = require('../models/vendor.model');
const Withdraw = require('../models/withdraw.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


// Create or request for a withdrawal
const createWithdrawal = asyncHandler(async (req, res) => {
    const vendor = req.user.userId;
    const { amount } = req.body;
    validateMongoDbId(vendor);
    try {
        // Create new withdrawal
        const newWithdrawal = new Withdraw({ vendor, amount });
        await newWithdrawal.save();
        res.json(newWithdrawal);
    } catch (error) {
        throw new Error(error);
    }
});

// Get all wthdrawals of a vendor
const getAllWithdrawals = asyncHandler(async (req, res) => {
    const vendorId = req.user.userId;
    validateMongoDbId(vendorId);
    try {
        const allWithdrawals = await Withdraw.find({ vendor: vendorId });
        if (!allWithdrawals) {
            return res.status(404).json({ error: "You don't have any withdrawals yet" });
        }
        res.json(allWithdrawals);
    } catch (error) {
        throw new Error(error);
    }
});


// Get all wthdrawals of a vendor
const getaWithdrawal = asyncHandler(async (req, res) => {
    const vendorId = req.user.userId;
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


// Vendor cancel withdrawal request
const cancelWithdrawal = asyncHandler(async (req, res) => {
    const vendorId = req.body.userId;
    const { cancel } = req.body;
    const withdrawId = req.params.id;
    validateMongoDbId(vendorId);
    validateMongoDbId(withdrawId);
    try {

        const withdraw = await Withdraw.findOne({ withdrawId });
        const checkVendor = withdraw.vendor.toString();

        if (checkVendor !== vendorId) throw new Error("Not Authorised");

        if (checkVendor === vendorId) {
            const withdrawal = await Withdraw.findByIdAndUpdate(withdrawId, cancel, { new: true });
            if (!withdrawal) throw new Error("Withdrawal not found");
            res.status(200).json(withdrawal)
        }
    } catch (error) {
        throw new Error(error);
    }
});

// Vendor delete a withdrawal
const deleteWithdrawal = asyncHandler(async (req, res) => {
    const vendorId = req.user.userId;
    const withdrawId = req.params.id;
    validateMongoDbId(vendorId);
    validateMongoDbId(withdrawId);
    try {
        const withdraw = await Withdraw.findOne({ withdrawId });
        const checkVendor = withdraw.vendor.toString();

        if (checkVendor !== vendorId) throw new Error("Not Authorised");

        if (checkVendor === vendorId) {
            const deleteWithdraw = await Withdraw.findByIdAndDelete(withdrawId);
            if (!deleteWithdraw) throw new Error("Withdrawal not found");

            res.status(200).json("Withdrawal deleted successfully");
        };
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createWithdrawal,
    cancelWithdrawal,
    getAllWithdrawals,
    getaWithdrawal,
    deleteWithdrawal,
}