const Image = require('../models/image.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Upload an image
const uploadImage = asyncHandler (async (req, res) => {
  const { productId, imageUrl } = req.body;
  validateMongoDbId(productId);
  try {
    // Create new image
    const newImage = new Image({ productId, imageUrl });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all images for a product
const getProductImages = asyncHandler ( async (req, res) => {
  const productId = req.params.productId;
  validateMongoDbId(productId);
  try {
    const images = await Image.find({ productId });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an image
const deleteImage = asyncHandler (async  (req, res) => {
  const imageId = req.params.id;
  validateMongoDbId(productId);
  try {
    const deletedImage = await Image.findByIdAndDelete(imageId);
    if (!deletedImage) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  uploadImage,
  getProductImages,
  deleteImage
};