// const Vendor = require('../models/vendor.model');
const Image = require('../models/images.model');
const Product = require('../models/product.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


 //Upload images
 const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findProduct = await Product.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            }),
        }, { new: true });
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

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
    uploadImages,
    uploadImage,
    getProductImages,
    deleteImage,
  }