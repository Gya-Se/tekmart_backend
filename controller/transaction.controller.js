const Transaction = require("../models/transaction.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => {
  try {
    const user = req.body.userId;
    const { vendor, products, totalAmount, paymentMethod } = req.body;

    // Create new transaction
    const newTransaction = new Transaction({ vendor, user, products, totalAmount, paymentMethod });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all transactions for a user
const getUserTransactions = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  validateMongoDbId(userId);
  try {
    const transactions = await Transaction.find({ user: userId });
    res.json(transactions);
  } catch (error) {
    throw new Error(error);
  }
});

// Get user transactions for a user
const getUserTransactionById = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const transactId = req.params.id;
  validateMongoDbId(userId);
  validateMongoDbId(transactId);
  try {
    const transact = await Transaction.findOne({ productId });
    const getUser = transact.user.toString();

    if (getUser !== userId) throw new Error("Not Authorised");

    if (getUser === userId) {
      const transaction = await Transaction.findById({ transactId });
      res.json(transaction);
    };
  } catch (error) {
    throw new Error(error);
  }
});

// User cancel transaction request
const cancelTransaction = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const { cancel } = req.body;
  const transactId = req.params.id;
  validateMongoDbId(userId);
  validateMongoDbId(transactId);
  try {

    const transact = await Transaction.findOne({ transactId });
    const getUser = transact.vendor.toString();

    if (getUser !== userId) throw new Error("Not Authorised");

    if (getUser === userId) {
      const transaction = await Transaction.findByIdAndUpdate(transactId, cancel, { new: true });
      if (!transaction) throw new Error("Transaction not found");
      res.status(200).json(transaction)
    }
  } catch (error) {
    throw new Error(error);
  }
});

// User delete a transaction
const deleteTransaction = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const transactId = req.params.id;
  validateMongoDbId(userId);
  validateMongoDbId(transactId);
  try {
    const transact = await Transaction.findOne({ transactId });
    const getAllProductUser = transact.vendor.toString();

    if (getAllProductUser !== userId) throw new Error("Not Authorised");

    if (getAllProductUser === userId) {
      const deleteWithdraw = await Withdraw.findByIdAndDelete(transactId);
      if (!deleteWithdraw) throw new Error("Transaction not found");

      res.status(200).json("Transaction deleted successfully");
    };
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createTransaction,
  getUserTransactions,
  getUserTransactionById,
  deleteTransaction,
  cancelTransaction
}