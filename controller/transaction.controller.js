const Transaction = require("../models/transaction.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { products, totalAmount, paymentMethod } = req.body;

    // Create new transaction
    const newTransaction = new Transaction({ userId, products, totalAmount, paymentMethod });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all transactions for a user
const getUserTransactions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
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
  const userId = req.user._id;
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




module.exports = {
  createTransaction,
  getUserTransactions,
  getUserTransactionById,
}