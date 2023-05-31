const Color = require('../models/color.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Get all colors
const getAllColors = asyncHandler (async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get color by ID
const getColorById = asyncHandler (async (req, res) => {
  const colorId = req.params.id;
  validateMongoDbId(colorId);
  try {
    const color = await Color.findById(colorId);
    if (!color) {
      return res.status(404).json({ error: 'Color not found' });
    }
    res.json(color);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new color
const createColor = asyncHandler (async (req, res) => {
  try {
    const { name } = req.body;
    // Create new color
    const newColor = new Color({ name });
    await newColor.save();
    res.json(newColor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update color by ID
const updateColorById = asyncHandler (async (req, res) => {
  const colorId = req.params.id;
  validateMongoDbId(colorId);
  try {
    const updates = req.body;
    const updatedColor = await Color.findByIdAndUpdate(colorId, updates, { new: true });
    if (!updatedColor) {
      return res.status(404).json({ error: 'Color not found' });
    }
    res.json(updatedColor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete color by ID
const deleteColorById = asyncHandler (async (req, res) => {
  const colorId = req.params.id;
  validateMongoDbId(colorId);
  try {
    const deletedColor = await Color.findByIdAndDelete(colorId);
    if (!deletedColor) {
      return res.status(404).json({ error: 'Color not found' });
    }
    res.json({ message: 'Color deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  getAllColors,
  getColorById,
  createColor,
  updateColorById,
  deleteColorById
};
