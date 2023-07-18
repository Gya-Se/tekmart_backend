const Transaction = require("../models/transaction.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


// // Create a new transaction
// const createTransaction = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { products, totalAmount, paymentMethod } = req.body;

//     // Create new transaction
//     const newTransaction = new Transaction({ userId, products, totalAmount, paymentMethod });
//     await newTransaction.save();
//     res.status(201).json(newTransaction);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// Get all transactions for a user
const getUserTransactions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongoDbId(userId);
  try {
    const transactions = await Transaction.find({ user: userId });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get user transactions for a user
const getUserTransactionById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const transactId = req.params.id;
  validateMongoDbId(userId);
  validateMongoDbId(transactId);
  try {
    const transact = await Transaction.findOne({ transactId });
    const getUser = transact.user.toString();

    if (getUser !== userId) res.status(400).send("Not Authorised");

    if (getUser === userId) {
      const transaction = await Transaction.findById({ transactId });

      res.status(200).json({
        success: true,
        data: transaction
      });
    };
  } catch (error) {
    res.status(400).send(error);
  }
});




module.exports = {
  // createTransaction,
  getUserTransactions,
  getUserTransactionById,
}