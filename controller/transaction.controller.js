const Transaction = require('../models/Transaction');

// Get all transactions for a user
const getUserTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await Transaction.find({ user: userId });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new transaction
const createTransaction = async (req, res) => {
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
};

module.exports = {
  getUserTransactions,
  createTransaction
};