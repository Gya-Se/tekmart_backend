// IMPORTING LIBRABRIES AND METHODS FROM DIRECTORIES
const Vendor = require("../models/vendor.model");
const Order = require("../models/order.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./email.controller");
const crypto = require("crypto");

//CREATING A VENDOR ACCOUNT
const createVendor = asyncHandler( async(req, res) => {
        const email = req.body.email;
        const findVendor = await Vendor.findOne({email});
        if (!findVendor) { 
            const newVendor = await Vendor.create(req.body);
            res.json({newVendor});
        }
        else {
            throw new Error("Vendor Already Exist");
        }
    }
);

//VENDOR LOGIN AND PASSWORD AUTHENTICATION
const vendorLogin =  asyncHandler( async(req, res) => {
    const {email, password} = req.body;
    const vendor = await Vendor.findOne({ email });
    if (vendor.role !== "vendor") throw new Error("Not Authorised");
    if(vendor && (await vendor.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(vendor?._id);
        const updatevendor = await Vendor.findByIdAndUpdate(vendor?._id, {
            refreshToken: refreshToken,
        }, 
        {new: true});
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            secure: false,
        });
        res.json({ 
            id: vendor?._id,
            name: vendor?.name,
            email: vendor?.email,
            token: generateToken(vendor?._id)
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
    const vendor = await Vendor.findOne({refreshToken});
    if(!vendor) throw new Error ("No refresh token present or matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || Vendor.id !== decoded.id){
            throw new Error ("There is something wrong with refresh token");
        }
        const accessToken = generateToken(vendor?._id);
        res.json({accessToken});
    });
});

//HANDLE LOGOUT
const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error ("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await Vendor.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly:true,
            secure: true,
        });
        return res.sendStatus(204); //FORBIDDEN
    };
await Vendor.findOneAndUpdate(refreshToken, {
    refreshToken: "",
});
res.clearCookie("refreshToken", {
    httpOnly:true,
    secure: true,
});
res.sendStatus(204); //FORBIDDEN
});

//vendor  UPDATE DETAILS
const updateVendor = asyncHandler(async(req, res) => {
    const {id} = req.user;
    validateMongoDbId(id);
    try {
        const updateVendor = await Vendor.findByIdAndUpdate(id,
            {
                name: req?.body?.name,
                email: req?.body?.email,
            }, {
                new: true,
            });
        res.json({updateVendor})
    } catch (error) {
        throw new Error(error);
    }
});

//vendor DELETE ACCOUNT
const deleteVendor = asyncHandler(async(req, res) => {
    const {id} = req.user;
    validateMongoDbId(id);
    try {
        const deleteVendor = await Vendor.findByIdAndDelete(id);
        res.json({deleteVendor})
    } catch (error) {
        throw new Error(error);
    }
});

//UPDATE PASSWORD
const updatePassword = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const vendor = await Vendor.findById(_id);
    if(password){
        Vendor.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(vendor);
    }
});

//FORGOT PASSWORD TOKEN
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const vendor = await Vendor.findOne({email});
    if(!vendor) throw new Error("User not found with this email address");
    try {
        const token = await vendor.createPasswordResetToken();
        await vendor.save();
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
    const vendor = await Vendor.findOne({
        //passwordResetToken: token,
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()},
    });
    if(!vendor) throw new Error("Token Expired, Please try again later");
    vendor.password = password;
    vendor.passwordResetToken = undefined;
    vendor.passwordResetExpires = undefined;
    await vendor.save();
    res.json(vendor);
});

//UPDATE vendorS ADDRESS
const saveAndUpdateAddress = asyncHandler(async(req, res) => {
    const {id} = req.user;
    validateMongoDbId(id);
    try {
        const updateAddress= await Vendor.findByIdAndUpdate(id,
            {
                address: req?.body?.address
            }, {
                new: true,
            });
        res.json({updateAddress})
    } catch (error) {
        throw new Error(error);
    }
});

//EXPORT MODULES
module.exports = {
    updateVendor, 
    createVendor, 
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    vendorLogin,
    saveAndUpdateAddress,
    deleteVendor
};