const Product = require('../models/product.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");


//****************  PRODUCT ********************************/

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
  const vendor = req.user.id;
  const { name, description, price, quantity} = req.body;
  validateMongoDbId(vendor);
  try {
    // Create new product
    const newProduct = new Product({ vendor, name, description, price, quantity});
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
  const vendorId = req.user;
  const productId = req.body.id;
  validateMongoDbId(vendorId);
  validateMongoDbId(productId);
  try {
    const vendor = await Product.findById(productId);

    console.log(vendorId);
    console.log(vendor);
    // if (vendor == vendorId) {
    //   const deletedProduct = await Product.findByIdAndDelete(productId);
    //   if (!deletedProduct) {
    //     return res.status(404).json({ error: 'Product not found' });
    //   }
    //   res.json({ message: 'Product deleted successfully' });
    // } else {
    //   throw new Error("You are not authorised");
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



//****************  REVIEWS ********************************/

// Get all reviews for a product
// const getProductReviews = asyncHandler (async (req, res) => {
//   const productId = req.params.productId;
//   validateMongoDbId(productId);
//   try {
//     const reviews = await Review.find({ product: productId });
//     res.json(reviews);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Create a new review for a product
// const createProductReview = asyncHandler (async (req, res) => {
//   try {
//     const { product, user, rating, comment } = req.body;
//     // Create new review
//     const newReview = new Review({ product, user, rating, comment });
//     await newReview.save();
//     res.status(201).json(newReview);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Update review by ID
// const updateReviewById = asyncHandler (async (req, res) => {
//   const reviewId = req.params.id;
//   validateMongoDbId(reviewId);
//   try {
//     const updates = req.body;
//     const updatedReview = await Review.findByIdAndUpdate(reviewId, updates, { new: true });
//     if (!updatedReview) {
//       return res.status(404).json({ error: 'Review not found' });
//     }
//     res.json(updatedReview);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Delete review by ID
// const deleteReviewById = asyncHandler (async (req, res) => {
//   const reviewId = req.params.id;
//   validateMongoDbId(reviewId);
//   try {
//     const deletedReview = await Review.findByIdAndDelete(reviewId);
//     if (!deletedReview) {
//       return res.status(404).json({ error: 'Review not found' });
//     }
//     res.json({ message: 'Review deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });



//****************  IMAGES ********************************/

// Upload an image
// const uploadImage = asyncHandler (async (req, res) => {
//   const { productId, imageUrl } = req.body;
//   validateMongoDbId(productId);
//   try {
//     // Create new image
//     const newImage = new Image({ productId, imageUrl });
//     await newImage.save();
//     res.status(201).json(newImage);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get all images for a product
// const getProductImages = asyncHandler ( async (req, res) => {
//   const productId = req.params.productId;
//   validateMongoDbId(productId);
//   try {
//     const images = await Image.find({ productId });
//     res.json(images);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Delete an image
// const deleteImage = asyncHandler (async  (req, res) => {
//   const imageId = req.params.id;
//   validateMongoDbId(productId);
//   try {
//     const deletedImage = await Image.findByIdAndDelete(imageId);
//     if (!deletedImage) {
//       return res.status(404).json({ error: 'Image not found' });
//     }
//     res.json({ message: 'Image deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


module.exports = {
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,

  // getProductReviews,
  // createProductReview,
  // updateReviewById,
  // deleteReviewById,

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