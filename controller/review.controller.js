const Order = require('../models/order.model');
const Product = require('../models/product.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


const review = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const { rating, comment, orderId } = req.body;
  const { productId } = req.params;
  validateMongoDbId(userId);
  validateMongoDbId(productId);
  try {
    const product = await Product.findById(productId);
    const review = {
      userId,
      rating,
      comment,
      productId,
    };

    const isReviewed = product.reviews.find(
      (rev) => rev.user._id === req.user._id
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user._id === req.user._id) {
          (rev.rating = rating), (rev.comment = comment), (rev.user = user);
        }
      });
    } else {
      product.reviews.push(review);
    }
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });

    await Order.findByIdAndUpdate(
      orderId,
      { $set: { "products.$[elem].isReviewed": true } },
      { arrayFilters: [{ "elem._id": productId }], new: true }
    );

    res.status(200).json({
      success: true,
      message: "Reviewed succesfully!",
    });
  } catch (error) {
    res.status(400).send(error);
  }
})


module.exports = {
  review
}