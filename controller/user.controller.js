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


// Create a new user
const createUser = asyncHandler(async (req, res) => {
  try {
    //Get user details
    const { firstname, lastname, email, password } = req.body;

    // Check if an account  with the same email already exists
    const existingVendor = await Vendor.findOne({ email: email });
    const existingUser = await User.findOne({ email: email });

    if (existingVendor || existingUser) {
      return res.json({ message: "An account with this email already exists", status: 404 });
    }

    const newUserDetails = new User({ firstname, lastname, email, password });
    await newUserDetails.save();

    res.status(200).json({
      success: true,
      message: "User created successfully!"
    });
  } catch (error) {
    res.status(400).send(error);
  }
});


// Update user avatar
const updateAvatar = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongoDbId(userId);
  try {
    const vendor = await Vendor.findById(vendorId);
    const existAvatarPath = `uploads/${vendor.avatar}`;
    fs.unlinkSync(existAvatarPath);

    const fileUrl = path.join(req.file.filename);
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar: fileUrl }, { new: true });
    if (!updatedUser) {
      return res.json({ message: "User not found", status: 404 });
    }

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update user details
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongoDbId(userId);
  try {
    const { firstname, lastname, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { firstname, lastname, phone }, { new: true });
    if (!updatedUser) {
      return res.json({ message: "User not found", status: 404 });
    }

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Update Address
const updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { addressType, streetAddress, town } = req.body;
  validateMongoDbId(userId);
  try {
    const user = await User.findById(userId);

    const sameTypeAddress = user.address.find(
      (address) => address.addressType === addressType
    );
    if (sameTypeAddress) {
      return next(
        new Error(`${addressType} address already exists`)
      );
    }

    const addressExists = user.address.find(
      (address) => address._id === req.body._id
    );

    if (addressExists) {
      Object.assign(addressExists, { streetAddress, town });
    } else {
      // add the new address to the array
      user.address.push({ streetAddress, town });
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Delete Address
const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const addressId = req.params.id;
  validateMongoDbId(userId);
  try {
    await User.updateOne(
      { _id: userId },
      { $pull: { address: { _id: addressId } } }
    );

    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User delete account
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongoDbId(userId);
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.json({ message: "User not found", status: 404 });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get user details
const getUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongoDbId(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ message: "User not found", status: 404 });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//User login
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) res.json({ message: "User not found", status: 404 });

  if (user.isBlocked === true) res.json({ message: "Your account is blocked. Contact our customer service for support on how to recover your account", status: 404 });

  if (user && (await user.isPasswordMatched(password))) {
    const token = generateRefreshToken(user._id);
    await User.findByIdAndUpdate(user._id, { token: token, },
      { new: true }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      secure: false,
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.json({ message: "Invalid Credentials", status: 404 });
  }
});

//Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.token) res.status(400).send("No token in cookies");
  const token = cookie.token;
  const user = await User.findOne({ token });
  if (!user) res.status(400).send("No Rtoken present or matched");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user._id !== decoded.id) {
      res.status(400).send("There is something wrong with token");
    }
    const accessToken = generateToken(user._id);
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
  const user = await User.findOne({ token });
  if (!user) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(403); //FORBIDDEN
  }
  await User.findOneAndUpdate(token, {
    token: "",
  });
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Log out successfully"
  });
  res.sendStatus(403); //FORBIDDEN
});

//Update password
const updatePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { oldPassword, newPassword, confirmPassword } = req.body;
  validateMongoDbId(userId);
  try {
    const user = await User.findById(userId).select("+password");

    const checkPassword = await user.isPasswordMatched(oldPassword);

    if (!checkPassword) res.status(400).send("Old password is incorrect!");
    if (newPassword !== confirmPassword) {
      res.status(400).send("Password doesn't matched with each other!")
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Forgot password token
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) res.status(400).send("User not found with this email address");
    const token = await user.createPasswordResetToken();
    await user.save();

    const activationUrl = `<a href= https://tekmart.cyclic.app/api/v1/user/reset-password/${token}> Reset Password </a>`;
    try {
      sendEmail({
        email: user.email,
        subject: "Reset your password",
        message: `Hello ${user.firstname}, please click on the link to reset your password. This link is valid for 10 minutes from now. ${activationUrl}`,
      });

      res.status(200).json({
        success: true,
        message: `Please check your email:- ${user.email} to reset your password!`
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

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) res.status(400).send("Token expired, please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully!"
  });
});

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  userLogin,
  handleRefreshToken,
  forgotPasswordToken,
  logout,
  resetPassword,
  updatePassword,
  updateAddress,
  updateAvatar,
  deleteAddress,
  getUser,
};