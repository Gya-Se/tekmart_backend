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
        return res.status(400).json({ error: "An account with this email already exists" });
      }
    
    const newUser = new User({firstname, lastname, email, password});
    await newUser.save();

    res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// Update user avatar
const updateAvatar = asyncHandler(async (req, res) => {
  const userId = req.user;
  validateMongoDbId(userId);
  try {
    const fileUrl = path.join(req.file.filename);
    const updatedUser = await User.findByIdAndUpdate(userId, {avatar: fileUrl}, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// Update user details
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user;
  validateMongoDbId(userId);
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

//Update Address
const saveAndUpdateAddress = asyncHandler(async (req, res) => {
  const userId = req.user;
  validateMongoDbId(userId);
  try {
    const updateAddress = await User.findByIdAndUpdate(
      userId,
      { address: req.body.address },{ new: true });
    res.status(200).json(updateAddress);
  } catch (error) {
      console.error(error);
      throw new Error(error);
  }
});


// User delete account
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user;
  validateMongoDbId(userId);
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

//User login
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(user.id);
    const updateuser = await User.findByIdAndUpdate(
      user.id,
      { refreshToken: refreshToken, },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      secure: false,
    });
    res.json({
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token present or matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//Handle logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //FORBIDDEN
  }
  await User.findOneAndUpdate(refreshToken, {
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
  const userId = req.user;
  const { password } = req.body;
  validateMongoDbId(userId);
  try {
    const user = await User.findById(userId);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//Forgot password token
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email address");
    const token = await user.createPasswordResetToken();
    await user.save();
    const userName = user.firstname;
    const resetURL = `Please follow this link to reset your password. This link is valid for 10 minutes from now. <a href= http://localhost:5000/api/user/reset-password/${token}> Reset Password </a>`;
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
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  //console.log(hashedToken);
  //console.log(token);
  const user = await User.findOne({
    //passwordResetToken: token,
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
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
  saveAndUpdateAddress,
  updateAvatar,
};