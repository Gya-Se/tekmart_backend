const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const sendEmail = require("./email.controller");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


// Create a new vendor
//POST request
const createVendor = asyncHandler(async (req, res) => {
    try {
        //Get vendor details
        const { shopName, email, password, phone } = req.body;

        // Check if vendor with the same email already exists
        const existingVendor = await Vendor.findOne({ email: email });
        const existingUser = await User.findOne({ email: email });

        if (existingVendor || existingUser) {
            return res.status(400).json({ error: "An account with this email already exists" });
        }

        const newVendor = new Vendor(shopName, password, phone);
        await newVendor.save();

        res.status(200).json(newVendor);
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
});

//vendor  update details
//PUT request
const updateVendor = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    validateMongoDbId(userId);
    try {
        const updates = req.body;
        const updatedVendor = await Vendor.findByIdAndUpdate(userId, updates, { new: true });
        if (!updatedVendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        res.status(200).json(updatedVendor)
    } catch (error) {
        throw new Error(error);
    }
});

//Update vendor address
//PUT request
const saveAndUpdateAddress = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    validateMongoDbId(userId);
    try {
        const updateAddress = await Vendor.findByIdAndUpdate(userId,
            { address: req.body.address }, { new: true });
        res.status(200).json(updateAddress);
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
});

//vendor delete account
//DELETE request
const deleteVendor = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    validateMongoDbId(userId);
    try {
        const deletedVendor = await Vendor.findByIdAndDelete(userId);
        if (!deletedVendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
});

//Vendor login
//POST request
const vendorLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (vendor.role !== "vendor") throw new Error("Not Authorised");
    if (vendor && (await vendor.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(vendor.id);
        const updatevendor = await Vendor.findByIdAndUpdate(vendor.id, {
            refreshToken: refreshToken,
        }, { new: true });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            secure: false,
        });
        res.status(200).json({
            id: vendor.id,
            name: vendor.name,
            email: vendor.email,
            token: generateToken(vendor.id)
        });
    }
    else {
        throw new Error("Invalid Credentials");
    }
});

//Handle refresh token
//GET request
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const vendor = await Vendor.findOne({ refreshToken });
    if (!vendor) throw new Error("No refresh token present or matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || Vendor.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(vendor?._id);
        res.json({ accessToken });
    });
});

//Handle logout
//GET request
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await Vendor.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); //FORBIDDEN
    };
    await Vendor.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); //FORBIDDEN
});

//Update password
//PUT request
const updatePassword = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    const { password } = req.body;
    validateMongoDbId(userId);
    try {
        const vendor = await Vendor.findById(userId);
        if (password) {
            vendor.password = password;
            const updatedPassword = await vendor.save();
            res.json(updatedPassword);
        } else {
            res.json(vendor);
        }
    } catch (error) {
        throw new Error(error);
    }
});

//Forgot password token
//POST request
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor) throw new Error("Vendor not found with this email address");
        const token = await vendor.createPasswordResetToken();
        await vendor.save();
        const userName = vendor.shopName;
        const resetURL = `Please follow this link to reset your password. This link is valid for 10 minutes from now. <a href= 'http://localhost:5000/v1/api/user/reset-password/${token}> Reset Password </a>`;
        const data = {
            to: email,
            text: `Hi ${userName}`,
            subject: "Reset Forgotten Password",
            htm: resetURL,
        };
        sendEmail(data);
        res.status(200).json(token);
    } catch (error) {
        throw new Error(error);
    }
});

//Reset password
//PUT request
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    //console.log(hashedToken);
    //console.log(token);
    const vendor = await Vendor.findOne({
        //passwordResetToken: token,
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!vendor) throw new Error("Token Expired, Please try again later");
    vendor.password = password;
    vendor.passwordResetToken = undefined;
    vendor.passwordResetExpires = undefined;
    await vendor.save();
    res.json(vendor);
});

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