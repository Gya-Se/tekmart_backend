const Brand = require('../models/brand.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Get all brands
const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get brand by ID
const getBrandById = asyncHandler(async (req, res) => {
  const brandId = req.params.id;
  validateMongoDbId(colorId);
  try {
    const color = await Brand.findById(colorId);
    if (!color) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(color);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new brand
const createBrand = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    // Create new brand
    const newBrand = new Brand({ name });
    await newBrand.save();
    res.json(newBrand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update brand by ID
const updateBrandById = asyncHandler(async (req, res) => {
  const brandId = req.params.id;
  validateMongoDbId(brandId)
  try {
    const updates = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(brandId, updates, { new: true });
    if (!updatedBrand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(updatedBrand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete brand by ID
const deleteBrandById = asyncHandler (async (req, res) => {
  const brandId = req.params.id;
  validateMongoDbId(brandId);
  try {
    const deletedBrand= await Brand.findByIdAndDelete(brandId);
    if (!deletedBrand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrandById,
  deleteBrandById
};
