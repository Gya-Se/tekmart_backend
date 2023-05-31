const Product = require('../models/product.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Get product by ID
const getProductById = asyncHandler (async (req, res) => {
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
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new product
const createProduct = asyncHandler (async (req, res) => {
  try {
    const { name, description, price, vendor } = req.body;
    // Create new product
    const newProduct = new Product({ name, description, price, vendor });
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product by ID
const updateProductById = asyncHandler (async (req, res) => {
  const productId = req.params.id;
  validateMongoDbId(productId);
  try {
    const updates = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product by ID
const deleteProductById = asyncHandler (async (req, res) => {
  const productId = req.params.id;
  validateMongoDbId(productId);
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById
};

//GET ALL PRODUCT
// const getallProduct = asyncHandler( async(req, res) => {
//     try {
//         //FILTERING
//         const queryObj = {...req.query};
//         const excludeFields = ["page", "sort", "limit","fields"];
//         excludeFields.forEach((el) => delete queryObj[el]);
//         console.log(queryObj);
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b (gte|gt|lte|lt)\b/g, (match) => $$,{match});

//         let query = Product.find(JSON.parse(queryStr));

//         //SORTING
//         if(req.query.sort){
//             const sortBy = req.query.sort.split(",").join(" ");
//             query = query.sort(sortBy);
//         } else {
//             query = query.sort("-createdAt");
//         }

//         //LIMITING THE FIELDS
//         if(req.query.fields){
//         const fields = req.query.fields.split(",").join(" ");
//         query = query.select(fields);
//         } else {
//             query = query.select("-__V");
//         }

//         //PAGINATION
//         const page = req.query.page;
//         const limit = req.query.limit;
//         const skip = (page - 1) * limit;
//         query = query.skip(skip).limit(skip);

//         if(req.query.page){
//             const productCount = await Product.countDocuments();
//             if (skip >= productCount) throw new Error("This page doesn't exist");
//         }
//         console.log(page, limit, skip);

//         const product = await query;
//         res.json(product);

//     } catch (error) {
//         throw new Error (error);
//     }
// });

// //ADD TO WISHLIST
// const addToWishlist = asyncHandler( async(req, res) => {
//     const {id} = req.user;
//     const { prodId } = req.body;
//     validateMongoDbId(id);
//     try {
//         const user = await User.findById(id);
//         const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
//         if(alreadyAdded){
//             let user = await User.findByIdAndUpdate(id, {
//                 $pull: {wishlist: prodId},
//             },
//             {
//                 new: true,
//             });
//             res.json(user);
//         }
//         else {
//             let user = await User.findByIdAndUpdate(id, {
//                 $push: {wishlist: prodId},
//             },
//             {
//                 new: true,
//             });
//             res.json(user);
//         }
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// //RATING
// const rating = asyncHandler (async (req, res) => {
//     const { id } = req.user;
//     validateMongoDbId(id);
//     const {star, prodId, comment} = req.body;
//     try {
//         const product = await Product.findById(prodId);
//         let alreadyRated = product.review.find(
//             (userId) =>  userId.postedby.toString() === id.toString()
//         );
//         if(alreadyRated){
//             const updateRating = await Product.updateOne(
//                 {
//                     ratings: {$elemMatch: alreadyRated},
//                 },
//                 {
//                     $set: {"ratings.$.star": star, "ratings.$.comment": comment}
//                 },
//                 {
//                     new: true,
//                 }
//                 );
//                 res.json(updateRating);
//         } else {
//             const rateProduct = await Product.findByIdAndUpdate(
//                 prodId, {
//                     $push: {
//                         ratings: {
//                             star: star,
//                             comment: comment,
//                             postedby: id,
//                         },
//                     },
//                 },
//                 {new: true},
//             );
//             res.json(rateProduct);
//         };

//         const getallRatings = await Product.findById(prodId);
//         let totalRating = getallRatings.ratings.length;
//         let ratingSum = getallRatings.ratings.map((item )=> item.star).reduce((prev, curr) => prev + curr, 0);
//         let actualRating = Math.round(ratingSum / totalRating);
//         let finalProduct = await Product.findByIdAndUpdate(
//             prodId,
//             {
//                 totalRating: actualRating,
//             },
//             {
//                 new: true,
//             }
//         );
//         res.json(finalProduct);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// //UPLOAD IMAGES
// const uploadImages = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     validateMongoDbId(id);
//     try {
//         const uploader = (path) => cloudinaryUploadImg(path, "images");
//         const urls = [];
//         const files = req.files;
//         for (const file of files) {
//             const { path } = file;
//             const newpath = await uploader(path);
//             urls.push(newpath);
//             fs.unlinkSync(path);
//         }
//         const findProduct = await Product.findByIdAndUpdate(id, {
//             images: urls.map((file) => {
//                 return file;
//             }),
//         }, { new: true });
//         res.json(findProduct);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// module.exports = {
//     createProduct, 
//     getaProduct, 
//     getallProduct, 
//     updateProduct, 
//     deleteProduct,
//     addToWishlist,
//     rating,
//     uploadImages
// };