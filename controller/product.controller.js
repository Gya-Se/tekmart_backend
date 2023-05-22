const Product = require("../models/product.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const fs = require("fs");
const validateMongoDbId = require("../utils/validateMongoDbId");
const cloudinaryUploadImg = require("../utils/cloudinary.utils");

//CREATE A PRODUCT
const createProduct = asyncHandler( async(req, res) => {
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        };
        const newProduct = await Product.create(req.body);
        res.json(newProduct);

    } catch (error) {
        throw new Error (error)
    }
});

//UPDATE A PRODUCT
const updateProduct = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        };
        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updateProduct);

    } catch (error) {
        throw new Error (error)
    }
});

//DELETE A PRODUCT
const deleteProduct = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        };
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);

    } catch (error) {
        throw new Error (error)
    }
});

//GET A PRODUCT
const getaProduct = asyncHandler( async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct);

    } catch (error) {
        throw new Error (error)
    }
});

//GET ALL PRODUCT
const getallProduct = asyncHandler( async(req, res) => {
    try {
        //FILTERING
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit","fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b (gte|gt|lte|lt)\b/g, (match) => $$,{match});

        let query = Product.find(JSON.parse(queryStr));

        //SORTING
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        //LIMITING THE FIELDS
        if(req.query.fields){
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

        if(req.query.page){
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page doesn't exist");
        }
        console.log(page, limit, skip);

        const product = await query;
        res.json(product);

    } catch (error) {
        throw new Error (error);
    }
});

//ADD TO WISHLIST
const addToWishlist = asyncHandler( async(req, res) => {
    const {id} = req.user;
    const { prodId } = req.body;
    validateMongoDbId(id);
    try {
        const user = await User.findById(id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(id, {
                $pull: {wishlist: prodId},
            },
            {
                new: true,
            });
            res.json(user);
        }
        else {
            let user = await User.findByIdAndUpdate(id, {
                $push: {wishlist: prodId},
            },
            {
                new: true,
            });
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});


//RATING
const rating = asyncHandler (async (req, res) => {
    const { id } = req.user;
    validateMongoDbId(id);
    const {star, prodId, comment} = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) =>  userId.postedby.toString() === id.toString()
        );
        if(alreadyRated){
            const updateRating = await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated},
                },
                {
                    $set: {"ratings.$.star": star, "ratings.$.comment": comment}
                },
                {
                    new: true,
                }
                );
                res.json(updateRating);
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId, {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: id,
                        },
                    },
                },
                {new: true},
            );
            res.json(rateProduct);
        };

        const getallRatings = await Product.findById(prodId);
        let totalRating = getallRatings.ratings.length;
        let ratingSum = getallRatings.ratings.map((item )=> item.star).reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingSum / totalRating);
        let finalProduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalRating: actualRating,
            },
            {
                new: true,
            }
        );
        res.json(finalProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//UPLOAD IMAGES
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findProduct = await Product.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            }),
        }, { new: true });
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//FILTER PRODUCT
// const filterProduct = asyncHandler( async(req, res) => {
//     const {minprice, maxprice, color, category, availability, brand} = req.params;
//     console.log(req.query);

//     try {
//         const filterProduct = await Product.find({
//             price: {
//                 $gte: minprice,
//                 $lte: maxprice,
//             },
//             category,
//             brand,
//             color,
//             availability,
//         });
//         res.json(filterProduct);

//     } catch (error) {
//         throw new Error (error)
//     }

//     res.json({
//         minprice, maxprice, category, brand,color, availability, 
//     })
// });



module.exports = {
    createProduct, 
    getaProduct, 
    getallProduct, 
    updateProduct, 
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages
};