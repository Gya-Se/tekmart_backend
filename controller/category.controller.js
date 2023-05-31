const Category = require('../models/category.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Get all categories
const getAllCategories = asyncHandler (async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get category by ID
const getCategoryById = asyncHandler (async (req, res) => {
  const categoryId = req.params.id;
  validateMongoDbId(categoryId);
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new category
const createCategory = asyncHandler (async (req, res) => {
  try {
    const { name } = req.body;
    // Create new category
    const newCategory = new Category({ name });
    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update category by ID
const updateCategoryById = asyncHandler (async (req, res) => {
  const categoryId = req.params.id;
  validateMongoDbId(categoryId);
  try {
    const updates = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updates, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete category by ID
const deleteCategoryById = asyncHandler (async (req, res) => {
  const categoryId = req.params.id;
  validateMongoDbId(categoryId);
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById
};
