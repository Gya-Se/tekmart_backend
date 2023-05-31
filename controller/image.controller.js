const Image = require('../models/Image');

// Upload an image
const uploadImage = async (req, res) => {
  try {
    const { productId, imageUrl } = req.body;
    // Create new image
    const newImage = new Image({ productId, imageUrl });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all images for a product
const getProductImages = async (req, res) => {
  try {
    const productId = req.params.productId;
    const images = await Image.find({ productId });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete an image
const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const deletedImage = await Image.findByIdAndDelete(imageId);
    if (!deletedImage) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  uploadImage,
  getProductImages,
  deleteImage
};