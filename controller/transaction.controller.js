const Transaction = require('../models/transaction.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Get all transactions for a user
const getUserTransactions = asyncHandler (async (req, res) => {
  const userId = req.params.userId;
  validateMongoDbId(userId);
  try {
    const transactions = await Transaction.find({ user: userId });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new transaction
const createTransaction = asyncHandler (async (req, res) => {
  try {
    const { user, items, total } = req.body;
    // Create new transaction
    const newTransaction = new Transaction({ user, items, total });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  getUserTransactions,
  createTransaction
};