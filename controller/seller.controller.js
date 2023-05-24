//IMPORTING LIBRABRIES AND METHODS FROM DIRECTORIES
const Seller = require("../models/shop.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const Order = require("../models/order.model");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./email.controller");
const crypto = require("crypto");
const uniqid = require('uniqid');

//CREATING A SELLER ACCOUNT
const createSeller = asyncHandler( async(req, res) => {
        const email = req.body.email;
        const findSeller = await Seller.findOne({email: email});
        if (!findSeller) { 
            const newSeller = await Seller.create(req.body);
            res.json({newSeller});
        }
        else {
            throw new Error("Seller Already Exist");
        }
    }
);

//SELLER LOGIN AND PASSWORD AUTHENTICATION
const sellerLogin =  asyncHandler( async(req, res) => {
    const {email, password} = req.body;
    const seller = await Seller.findOne({ email: email });
    if (seller.role !== "seller") throw new Error("Not Authorised");
    if(seller && (await seller.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(seller?._id);
        const updateseller = await Seller.findByIdAndUpdate(seller?._id, {
            refreshToken: refreshToken,
        }, 
        {new: true});
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            secure: false,
        });
        res.json({ 
            id: seller?._id,
            name: seller?.name,
            email: seller?.email,
            token: generateToken(seller?._id)
            });
    }
    else {
        throw new Error ("Invalid Credentials");
    }
});

//HANDLE REFRESH TOKEN
const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error ("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const seller = await Seller.findOne({refreshToken});
    if(!seller) throw new Error ("No refresh token present or matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || seller.id !== decoded.id){
            throw new Error ("There is something wrong with refresh token");
        }
        const accessToken = generateToken(seller?._id);
        res.json({accessToken});
    });
});

//HANDLE LOGOUT
const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error ("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly:true,
            secure: true,
        });
        return res.sendStatus(204); //FORBIDDEN
    };
await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
});
res.clearCookie("refreshToken", {
    httpOnly:true,
    secure: true,
});
res.sendStatus(204); //FORBIDDEN
});

//SELLER  UPDATE DETAILS
const updateAseller = asyncHandler(async(req, res) => {
    const {id} = req.user;
    validateMongoDbId(id);
    try {
        const updateaUser = await Seller.findByIdAndUpdate(id,
            {
                name: req?.body?.name,
                email: req?.body?.email,
            }, {
                new: true,
            });
        res.json({updateaUser})
    } catch (error) {
        throw new Error(error);
    }
});

//SELLER DELETE ACCOUNT
const deleteAseller = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({deleteaUser})
    } catch (error) {
        throw new Error(error);
    }
});

//UPDATE PASSWORD
const updatePassword = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const seller = await Seller.findById(_id);
    if(password){
        seller.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(seller);
    }
});

//FORGOT PASSWORD TOKEN
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await Seller.findOne({email});
    if(!user) throw new Error("User not found with this email address");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid for 10 minutes from now. <a href= 'http://localhost:5000/api/user/reset-password/${token}> Reset Password </a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});

//RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    //console.log(hashedToken);
    //console.log(token);
    const user = await Seller.findOne({
        //passwordResetToken: token,
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()},
    });
    if(!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

//UPDATE SELLERS ADDRESS
const saveAddress = asyncHandler(async(req, res) => {
    const {id} = req.user;
    validateMongoDbId(id);
    try {
        const cNdUaddress= await Seller.findByIdAndUpdate(id,
            {
                address: req?.body?.address
            }, {
                new: true,
            });
        res.json({cNdUaddress})
    } catch (error) {
        throw new Error(error);
    }
});

//GET USER ORDERS 
const getOrders = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateMongoDbId(id);
    try {
        const userOrders = await Order.findOne({ orderby: id }).populate("products.product").exec();
        res.json(userOrders);
    } catch (error) {
        throw new Error(error);
    }
});

//UPDATE ORDER STATUS
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status} = req.body;
    const { id } = req.user;
    validateMongoDbId(id);
    try {
        const updateOrdStatus = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            }, {
                new: true,
            },
       )
        res.json(updateOrdStatus);
    } catch (error) {
        throw new Error(error);
    }
});

//EXPORT MODULES
module.exports = {
    updateAseller, 
    createSeller, 
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    sellerLogin,
    saveAddress,
    getOrders,
    updateOrderStatus,
    deleteAseller
};