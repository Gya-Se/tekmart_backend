const Page = require('../models/Page');

// Get all pages
const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get page by slug
const getPageBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const page = await Page.findOne({ slug });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new page
const createPage = async (req, res) => {
  try {
    const { title, content, slug } = req.body;
    // Create new page
    const newPage = new Page({ title, content, slug });
    await newPage.save();
    res.status(201).json(newPage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a page
const updatePage = async (req, res) => {
  try {
    const pageId = req.params.id;
    const { title, content, slug } = req.body;
    const updatedPage = await Page.findByIdAndUpdate(
      pageId,
      { title, content, slug },
      { new: true }
    );
    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(updatedPage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a page
const deletePage = async (req, res) => {
  try {
    const pageId = req.params.id;
    const deletedPage = await Page.findByIdAndDelete(pageId);
    if (!deletedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage
};