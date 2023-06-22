const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const sendEmail = require("./email.controller");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateToken, createActivationToken } = require("../config/jwtToken");
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

    const user = {
      firstname,
      lastname,
      email,
      password
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `<a href="http://localhost:5000/v1/api/user/activation/${activationToken}">Activate Account</a>`;
    try {
      sendEmail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.firstname}, please click on the link to activate your account. ${activationUrl}`,
      });
      res.status(201).json(`Please check your email:- ${user.email} to activate your account`);
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

//Activate user
const activateUser = asyncHandler(async (req, res) => {
  try {
    const { activation_token } = req.body;
    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    if (!newUser) {
      throw new Error("Invalid token");
    }
    const { firstname, lastname, email, password } = newUser;

    const newUserDetails = new Vendor(firstname, lastname, email, password);
    await newUserDetails.save();
    res.status(200).json(newUserDetails)

  } catch (error) {
    throw new Error(error);
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
      return res.status(404).json("User not found");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    throw new Error(error);
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
      return res.status(404).json("User not found");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    throw new Error(error);
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

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    throw new Error(error);
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

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// User delete account
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  validateMongoDbId(userId);
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json("User not found");
    }
    res.status(200).json("User deleted successfully");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

//User login
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user.role !== "customer" || user.role !== "admin") throw new Error("Not Authorised");
  if (user && (await user.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken, },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      secure: false,
    });
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: generateToken(user._id),
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
    if (err || user._id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user._id);
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
    return res.sendStatus(403); //FORBIDDEN
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.status(201).json("Log out successful!");
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

    if (!checkPassword) throw new Error("Old password is incorrect!");
    if (newPassword !== confirmPassword) {
      throw new Error("Password doesn't matched with each other!")
    }

    user.password = newPassword;
    await user.save();
    res.json("Password updated successfully!");
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

    const activationUrl = `<a href= http://localhost:5000/v1/api/user/reset-password/${token}> Reset Password </a>`;
    try {
      sendEmail({
        email: user.email,
        subject: "Reset your password",
        message: `Hello ${user.firstname}, please click on the link to reset your password. This link is valid for 10 minutes from now. ${activationUrl}`,
      });
      res.status(200).json(`Please check your email:- ${user.email} to reset your password!`);
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    throw new Error(error);
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
  updateAddress,
  updateAvatar,
  activateUser,
  deleteAddress,
};