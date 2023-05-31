const Review = require('../models/review.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Get all reviews for a product
const getProductReviews = asyncHandler (async (req, res) => {
  const productId = req.params.productId;
  validateMongoDbId(productId);
  try {
    const reviews = await Review.find({ product: productId });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new review for a product
const createProductReview = asyncHandler (async (req, res) => {
  try {
    const { product, user, rating, comment } = req.body;
    // Create new review
    const newReview = new Review({ product, user, rating, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update review by ID
const updateReviewById = asyncHandler (async (req, res) => {
  const reviewId = req.params.id;
  validateMongoDbId(reviewId);
  try {
    const updates = req.body;
    const updatedReview = await Review.findByIdAndUpdate(reviewId, updates, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete review by ID
const deleteReviewById = asyncHandler (async (req, res) => {
  const reviewId = req.params.id;
  validateMongoDbId(reviewId);
  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  getProductReviews,
  createProductReview,
  updateReviewById,
  deleteReviewById
};