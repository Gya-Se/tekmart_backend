const Brand = require('../models/Brand');

// Get all brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get brand by ID
const getBrandById = async (req, res) => {
  try {
    const colorId = req.params.id;
    const color = await Brand.findById(colorId);
    if (!color) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(color);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new brand
const createBrand = async (req, res) => {
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
};

// Update brand by ID
const updateBrandById = async (req, res) => {
  try {
    const brandId = req.params.id;
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
};

// Delete brand by ID
const deleteBrandById = async (req, res) => {
  try {
    const brandId = req.params.id;
    const deletedBrand= await Brand.findByIdAndDelete(brandId);
    if (!deletedBrand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrandById,
  deleteBrandById
};
