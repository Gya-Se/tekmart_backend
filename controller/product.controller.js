const Product = require('../models/product.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const fs = require("fs");


// Vendor create a new product
const createProduct = asyncHandler(async (req, res) => {
  const vendor = req.user._id;
  const product= req.body;
  validateMongoDbId(vendor);
  try {
    // Create new product
    const files = req.files;
    const imageUrls = files.map((file) => `${file.filename}`);

    product.images = imageUrls;
    product.vendor = vendor;

    const newProduct = new Product({ product });
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vendor update product by ID
const updateProductById = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const { productId } = req.body;
  validateMongoDbId(vendorId);
  validateMongoDbId(productId);
  try {
    const product = await Product.findOne({ vendor: vendorId });
    const checkVendor = product.vendor.toString();

    if (checkVendor !== vendorId) throw new Error("Not Authorised");

    if (checkVendor === vendorId) {
      const updates = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updatedProduct);
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// Vendor delete product by ID
const deleteProductById = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const productId = req.params.id;
  validateMongoDbId(vendorId);
  validateMongoDbId(productId);

  try {
    const product = await Product.findOne({ productId });
    const getVendor = product.vendor.toString();

    if (getVendor !== vendorId) throw new Error("Not Authorised");

    if (getVendor === vendorId) {
      product.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json("Product deleted successfully");
    }

  } catch (error) {
    throw new Error(error);
  }
});

// User and vendor get product by ID
const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  validateMongoDbId(productId);
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

//User get all product to filter, sort and paginate
const getAllProductUser = asyncHandler(async (req, res) => {
  try {
    //FILTERING
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b (gte|gt|lte|lt)\b/g, (match) => $$, { match });

    let query = Product.find(JSON.parse(queryStr));

    //SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //LIMITING THE FIELDS
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__V");
    }

    //PAGINATION
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(skip);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page doesn't exist");
    }
    console.log(page, limit, skip);

    const product = await query;
    res.json(product);

  } catch (error) {
    throw new Error(error);
  }
});

//Vendor get all products of store
const getVendorProducts = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  validateMongoDbId(vendorId);
  try {
    const allProducts = await Product.find({ vendor: vendorId });
    if (!allProducts) {
      return res.status(404).json({ error: "You don't have any products yet" });
    }
    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


//User get all products of a vendor's store
const userGetVendorProducts = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;
  validateMongoDbId(vendorId);
  try {
    const allProducts = await Product.find({ vendor: vendorId });
    if (!allProducts) {
      return res.status(404).json({ error: "Vendor don't have any products yet" });
    }
    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = {
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  getAllProductUser,
  getVendorProducts,
  userGetVendorProducts,

};