
//Rating
// const rating = asyncHandler(async (req, res) => {
//   const { id } = req.user;
//   validateMongoDbId(id);
//   const { star, productId, comment } = req.body;
//   try {
//     const product = await Product.findById(productId);
//     let alreadyRated = product.review.find(
//       (userId) => userId.postedby.toString() === id.toString()
//     );
//     if (alreadyRated) {
//       const updateRating = await Product.updateOne(
//         { ratings: { $elemMatch: alreadyRated }, },
//         { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
//         { new: true, }
//       );
//       res.json(updateRating);
//     } else {
//       const rateProduct = await Product.findByIdAndUpdate(
//         productId, {
//         $push: {
//           ratings: {
//             star: star,
//             comment: comment,
//             postedby: id,
//           },
//         },
//       },
//         { new: true },
//       );
//       res.json(rateProduct);
//     };

//     const getallRatings = await Product.findById(productId);
//     let totalRating = getallRatings.ratings.length;
//     let ratingSum = getallRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
//     let actualRating = Math.round(ratingSum / totalRating);
//     let finalProduct = await Product.findByIdAndUpdate(
//       productId,
//       { totalRating: actualRating, },
//       { new: true, }
//     );
//     res.json(finalProduct);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
