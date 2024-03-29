const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const sendEmail = require("./email.controller");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");


// Create a new vendor
const createVendor = asyncHandler(async (req, res) => {
    try {
        //Get vendor details
        const { shopName, email, password, phone } = req.body;

        // Check if vendor with the same email already exists
        const existingVendor = await Vendor.findOne({ email: email });
        const existingUser = await User.findOne({ email: email });

        if (existingVendor || existingUser) {
            return res.json({ message: "An account with this email already exists", status: 404 })
        }

        const newVendorDetails = new Vendor({ shopName, email, password, phone });
        await newVendorDetails.save();

        res.status(200).json({
            success: true,
            data: newVendorDetails
        });
    } catch (error) {
        res.status(400).send(error);
    }
});


// Update vendor avatar
const updateAvatar = asyncHandler(async (req, res) => {
    const vendorId = req.vendor._id;
    validateMongoDbId(vendorId);
    try {
        const vendor = await Vendor.findById(vendorId);
        const existAvatarPath = `uploads/${vendor.avatar}`;
        fs.unlinkSync(existAvatarPath);

        const fileUrl = path.join(req.file.filename);
        const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, { avatar: fileUrl }, { new: true });
        if (!updatedVendor) {
            return res.json({ message: "Vendor not found", status: 404 });
        }

        res.status(200).json({
            success: true,
            data: updatedVendor
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

//Vendor  update details
const updateVendor = asyncHandler(async (req, res) => {
    const vendorId = req.vendor._id;
    validateMongoDbId(vendorId);
    try {
        const { description, address, phone } = req.body;
        const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, { description, address, phone }, { new: true });
        if (!updatedVendor) {
            return res.json({ message: "Vendor not found", status: 404 });
        }

        res.status(200).json({
            success: true,
            data: updatedVendor
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

//Vendor delete account
const deleteVendor = asyncHandler(async (req, res) => {
    const vendorId = req.vendor._id;
    validateMongoDbId(vendorId);
    try {
        const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
        if (!deletedVendor) {
            return res.json({ message: "Vendor not found", status: 404 });
        }

        res.status(200).json({
            success: true,
            message: "Vendor deleted successfully"
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get vendor details
const getVendor = asyncHandler(async (req, res) => {
    const vendorId = req.vendor._id;
    validateMongoDbId(vendorId);
    try {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.json({ message: "Vendor not found", status: 404 });
        }

        res.status(200).json({
            success: true,
            data: vendor
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

//Vendor login
const vendorLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });

    if (!vendor) res.status(400).send("Invalid Credentials");

    if (vendor.role !== "vendor") res.status(400).send("Not Authorised");

    if (vendor.isBlocked === true) res.status(400).send("Your account is blocked. Contact our customer service for support on how to recover your account");

    if (vendor && (await vendor.isPasswordMatched(password))) {
        const token = generateRefreshToken(vendor._id);
        await Vendor.findByIdAndUpdate(vendor._id, { token: token },
            { new: true }
        );
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            secure: false,
        });

        res.status(200).json({
            success: true,
            _id: vendor._id,
            name: vendor.name,
            email: vendor.email,
            token: generateToken(vendor._id)
        });
    } else {
        res.status(400).send("Invalid Credentials");
    }
});

//Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.token) res.status(400).send("No token in cookies");
    const token = cookie.token;
    const vendor = await Vendor.findOne({ token });
    if (!vendor) res.status(400).send("No token present or matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || vendor._id !== decoded.id) {
            res.status(400).send("There is something wrong with token");
        }
        const accessToken = generateToken(vendor._id);

        res.status(200).json({
            success: true,
            data: accessToken
        });
    });
});

//Handle logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.token) res.status(400).send("No token in cookies");
    const token = cookie.token;
    const vendor = await Vendor.findOne({ token });
    if (!vendor) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(403); //FORBIDDEN
    };
    await Vendor.findOneAndUpdate(token, {
        token: "",
    });
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
    });

    res.status(200).json({
        success: true,
        message: "Log out successful!"
    });
    res.sendStatus(403); //FORBIDDEN
});

//Update password
const updatePassword = asyncHandler(async (req, res) => {
    const vendorId = req.vendor._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    validateMongoDbId(vendorId);
    try {
        const vendor = await Vendor.findById(vendorId).select("+password");

        const checkPassword = await vendor.isPasswordMatched(oldPassword);

        if (!checkPassword) res.status(400).send("Old password is incorrect!");
        if (newPassword !== confirmPassword) {
            res.status(400).send("Password doesn't matched with each other!")
        }

        vendor.password = newPassword;
        await vendor.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully!"
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

//Forgot password token
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor) res.status(400).send("Vendor not found with this email address");
        const token = await vendor.createPasswordResetToken();
        await vendor.save();

        const activationUrl = `<a href= https://tekmart.cyclic.app/api/v1/vendor/reset-password/${token}> Reset Password </a>`;
        try {
            sendEmail({
                email: vendor.email,
                subject: "Reset your password",
                message: `Hello ${vendor.shopName}, please click on the link to reset your password. This link is valid for 10 minutes from now. ${activationUrl}`,
            });

            res.status(200).json({
                success: true,
                message: `Please check your email:- ${vendor.email} to reset your password!`
            });
        } catch (error) {
            res.status(400).send(error);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

//Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const vendor = await Vendor.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!vendor) res.status(400).send("Token expired, please try again later");
    vendor.password = password;
    vendor.passwordResetToken = undefined;
    vendor.passwordResetExpires = undefined;
    await vendor.save();

    res.status(200).json({
        success: true,
        message: "Password reset successfully!"
    });
});

module.exports = {
    createVendor,
    forgotPasswordToken,
    vendorLogin,
    handleRefreshToken,
    getVendor,
    logout,
    deleteVendor,
    resetPassword,
    updatePassword,
    updateAvatar,
    updateVendor,
};