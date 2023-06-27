
//Rating
// const rating = asyncHandler(async (req, res) => {
//     const { id } = req.user;
//     validateMongoDbId(id);
//     const { star, productId, comment } = req.body;
//     try {
//         const product = await Product.findById(productId);
//         let alreadyRated = product.review.find(
//             (userId) => userId.postedby.toString() === id.toString()
//         );
//         if (alreadyRated) {
//             const updateRating = await Product.updateOne(
//                 { ratings: { $elemMatch: alreadyRated }, },
//                 { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
//                 { new: true, }
//             );
//             res.json(updateRating);
//         } else {
//             const rateProduct = await Product.findByIdAndUpdate(
//                 productId, {
//                 $push: {
//                     ratings: {
//                         star: star,
//                         comment: comment,
//                         postedby: id,
//                     },
//                 },
//             },
//                 { new: true },
//             );
//             res.json(rateProduct);
//         };

//         const getallRatings = await Product.findById(productId);
//         let totalRating = getallRatings.ratings.length;
//         let ratingSum = getallRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
//         let actualRating = Math.round(ratingSum / totalRating);
//         let finalProduct = await Product.findByIdAndUpdate(
//             productId,
//             { totalRating: actualRating, },
//             { new: true, }
//         );
//         res.json(finalProduct);
//     } catch (error) {
//         throw new Error(error);
//     }
// });



// //User get all products of a category
// const getProductByCategory = asyncHandler(async (req, res) => {
//     const { category } = req.params;
//     try {
//       const allCatProducts = await Product.find({ category: category });
//       if (!allCatProducts) {
//         return res.status(404).json({ error: "There is no products in this category yet" });
//       }
//       res.json(allCatProducts);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });

//   //User get all products of a brand
//   const getProductByBrand = asyncHandler(async (req, res) => {
//     const { brand } = req.params;
//     try {
//       const allBrandProducts = await Product.find({ brand: brand });
//       if (!allBrandProducts) {
//         return res.status(404).json({ error: "There is no products in this brand yet" });
//       }
//       res.json(allBrandProducts);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });



// // Update order by ID
// const updateOrderById = asyncHandler(async (req, res) => {
//     const orderId = req.params.id;
//     const userId = req.vendor._id;
//     validateMongoDbId(userId);
//     validateMongoDbId(orderId);
//     try {
//       const updates = req.body;
//       const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });
//       if (!updatedOrder) {
//         return res.status(404).json({ error: 'Order not found' });
//       }
//       res.json(updatedOrder);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });

//   // Delete order by ID
//   const deleteOrderById = asyncHandler(async (req, res) => {
//     const orderId = req.params.id;
//     validateMongoDbId(orderId);
//     try {
//       const deletedOrder = await Order.findByIdAndDelete(orderId);
//       if (!deletedOrder) {
//         return res.status(404).json({ error: 'Order not found' });
//       }
//       res.json({ message: 'Order deleted successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });