const Product = require("../models/product.models");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");


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
    const {id} = req.params;
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        };
        const updateProduct = await Product.findOneAndUpdate(id, req.body, {new: true});
        res.json(updateProduct);

    } catch (error) {
        throw new Error (error)
    }
});





//DELETE A PRODUCT
const deleteProduct = asyncHandler( async(req, res) => {
    const {id} = req.params;
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
    const {id} = req.params;
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct);

    } catch (error) {
        throw new Error (error)
    }
});


//GET ALL PRODUCT
const getallProduct = asyncHandler( async(req, res) => {
    console.log(req.query);
    try {
        const getallProduct = await Product.find();
        res.json(getallProduct);

    } catch (error) {
        throw new Error (error);
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



module.exports = {createProduct, getaProduct, getallProduct, updateProduct, deleteProduct};