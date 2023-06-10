const Transaction = require("../models/transaction.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    // Create new transaction
    const newTransaction = new Transaction({ userId, items, total });
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

module.exports = {
  createTransaction,
  getUserTransactions,
}