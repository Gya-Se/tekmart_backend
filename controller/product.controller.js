const Product = require('../models/product.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const fs = require("fs");


// Vendor create a new product
const createProduct = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  const product = req.body;
  validateMongoDbId(vendorId);
  try {
    // Create new product
    const files = req.files;
    const imageUrls = files.map((file) => `${file.filename}`);

    product.images = imageUrls;
    product.vendor = vendorId;

    const newProduct = new Product({ product });
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vendor update product by ID
const updateProduct = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  const { productId } = req.body;
  validateMongoDbId(vendorId);
  validateMongoDbId(productId);
  try {
    const product = await Product.findOne({ productId });
    const checkVendor = product.vendor.toString();

    if (checkVendor !== vendorId) throw new Error("Not Authorised");

    if (checkVendor === vendorId) {
      const updates = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(updatedProduct);
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// Vendor delete product by ID
const deleteProduct = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
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
const getProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  validateMongoDbId(productId);
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// User get  new products
const getNewArrivals = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    if (!products) {
      return res.status(404).json({ error: 'Products not found' });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// User get  top products
const getTopDeals = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ sold: -1 });
    if (!products) {
      return res.status(404).json({ error: 'Products not found' });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// User get  top category
const getTopCats = asyncHandler(async (req, res) => {
  let categories = [];
  try {
    const products = await Product.find().sort({ sold: -1 });

    //Count the number of occurences of each category in products
    //and storing only the category name and the number of occurences
    function countOccurrences(products) {
      const counts = {};
      for (const element of products) {
        if (counts[element.category]) {
          counts[element.category]++;
        } else {
          counts[element.category] = 1;
        }
      }
      return counts;
    }

    //Sort category by the number of occurences
    function sortByCount(counts) {
      const sortedCounts = [];
      for (const [element, count] of Object.entries(counts)) {
        sortedCounts.push({ element, count });
      }
      sortedCounts.sort((a, b) => b.count - a.count);
      sortedCounts.forEach((element) => {
        categories.push(element.element)
      });
      return categories;
    }

    const counts = countOccurrences(products);
    const sortedCategory = sortByCount(counts);

    if (!sortedCategory) {
      return res.status(404).json({ error: 'Categories not found' });
    }
    res.status(200).json(sortedCategory);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// User get  top category
const getTopBrands = asyncHandler(async (req, res) => {
  let brands = [];
  try {
    const products = await Product.find().sort({ sold: -1 });

    //Count the number of occurences of each brand in products
    //and storing only the brand name and the number of occurences
    function countOccurrences(products) {
      const counts = {};
      for (const element of products) {
        if (counts[element.brand]) {
          counts[element.brand]++;
        } else {
          counts[element.brand] = 1;
        }
      }
      return counts;
    }

    //Sort brand by the number of occurences
    function sortByCount(counts) {
      const sortedCounts = [];
      for (const [element, count] of Object.entries(counts)) {
        sortedCounts.push({ element, count });
      }
      sortedCounts.sort((a, b) => b.count - a.count);
      sortedCounts.forEach((element) => {
        brands.push(element.element)
      });
      return brands;
    }

    const counts = countOccurrences(products);
    const sortedBrand = sortByCount(counts);

    if (!sortedBrand) {
      return res.status(404).json({ error: 'Brands not found' });
    }
    res.status(200).json(sortedBrand);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});



// User get  top vendors
const getTopVendors = asyncHandler(async (req, res) => {
  let vendors = [];
  try {
    const products = await Product.find().sort({ sold: -1 });
    //Count the number of occurences of each vendor in products
    //and storing only the vendor name and the number of occurences
    function countOccurrences(products) {
      const counts = {};
      for (const element of products) {
        if (counts[element.vendor]) {
          counts[element.vendor]++;
        } else {
          counts[element.vendor] = 1;
        }
      }
      return counts;
    }

    //Sort brand by the number of occurences
    function sortByCount(counts) {
      const sortedCounts = [];
      for (const [element, count] of Object.entries(counts)) {
        sortedCounts.push({ element, count });
      }
      sortedCounts.sort((a, b) => b.count - a.count);
      sortedCounts.forEach((element) => {
        vendors.push(element.element)
      });
      return vendors;
    }

    const counts = countOccurrences(products);
    const sortedVendors = sortByCount(counts);

    if (!sortedVendors) {
      return res.status(404).json({ error: 'Vendors not found' });
    }
    res.status(200).json(sortedVendors);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

//Search for products
const productSearch = asyncHandler(async (req, res) => {
  const searchQuery = req.query.search;
  try {
    const products = await Product.find({
      $text: { $search: searchQuery }
    })
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
})

//User get all product to filter, sort and paginate
const productQuery = asyncHandler(async (req, res) => {
  try {
    //FILTERING
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((element) => delete queryObj[element]);
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

    const products = await query;
    res.status(200).json(products);

  } catch (error) {
    throw new Error(error);
  }
});

//Vendor get all products of store
const getVendorProducts = asyncHandler(async (req, res) => {
  const vendorId = req.vendor._id;
  validateMongoDbId(vendorId);
  try {
    const allProducts = await Product.find({ vendor: vendorId });
    if (!allProducts) {
      return res.status(404).json({ error: "You don't have any products yet" });
    }
    res.status(200).json(allProducts);
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
    res.status(200).json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productQuery,
  getNewArrivals,
  getTopDeals,
  getTopCats,
  getTopBrands,
  getTopVendors,
  getVendorProducts,
  userGetVendorProducts,
  productSearch,
};