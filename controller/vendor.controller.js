const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const sendEmail = require("./email.controller");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const { createVendorSchema } = require("../helpers/validation.schema");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


// Create a new vendor
const createVendor = asyncHandler(async (req, res) => {
    try {
        //Get vendor details
        const { shopName, email, password, phone } = req.body;

        //Validate vendor details joi
        const result = await createVendorSchema.validateAsync(req.body);

        // Check if vendor with the same email already exists
        const existingVendor = await Vendor.findOne({ email: result.email });
        const existingUser = await User.findOne({ email: result.email });

        if (existingVendor || existingUser) {
            return res.status(400).json({ error: "An account with this email already exists" });
        }

        const newVendor = new Vendor(result);
        await newVendor.save();

        res.json(newVendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

//vendor  update details
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
const saveAndUpdateAddress = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    validateMongoDbId(userId);
    try {
        const updateAddress = await Vendor.findByIdAndUpdate(userId,
            { address: req.body.address }, { new: true });
        res.status(200).json(updateAddress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

//vendor delete account
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
        res.status(500).json({ error: "Server error" });
    }
});

//Vendor login
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
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
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
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.body.userId;
    const { password } = req.body;
    validateMongoDbId(_id);
    const vendor = await Vendor.findById(_id);
    if (password) {
        Vendor.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(vendor);
    }
});

//Forgot password token
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) throw new Error("User not found with this email address");
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

//Reset password
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