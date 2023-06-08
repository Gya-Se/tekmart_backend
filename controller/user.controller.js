const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const Cart = require("../models/cart.model");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const jwt = require("jsonwebtoken");
const { createUserSchema } = require("../helpers/validation.schema");

//****************  USER ********************************/

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  try {
    //Get user details
    const { firstname, lastname, email, password } = req.body;
    //Validate user details joi
    const result = await createUserSchema.validateAsync(req.body);
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email: result.email });
    //If user exists, do this
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    //Else
    // Create new user with details
    const newUser = new User(result);
    await newUser.save();
    //Send back user details
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user;
  validateMongoDbId(userId);
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// User delete account
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  validateMongoDbId(userId);
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//USER LOGIN AND PASSWORD AUTHENTICATION
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser?._id,
      { refreshToken: refreshToken, },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      secure: false,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//HANDLE REFRESH TOKEN
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
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

//HANDLE LOGOUT
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
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

// //FORGOT PASSWORD TOKEN
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email address");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset your password. This link is valid for 10 minutes from now. <a href= http://localhost:5000/api/user/reset-password/${token}> Reset Password </a>`;
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

//UPDATE PASSWORD
const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.body.userId;
  const { password } = req.body;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
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

//SAVE AND UPDATE ADDRESS
const saveAndUpdateAddress = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const updateAddress = await User.findByIdAndUpdate(
      id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json({ updateAddress });
  } catch (error) {
    throw new Error(error);
  }
});

//****************  TRANSACTION ********************************/

// Get all transactions for a user
const getUserTransactions = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  validateMongoDbId(userId);
  try {
    const transactions = await Transaction.find({ user: userId });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    // Create new transaction
    const newTransaction = new Transaction({ userId, items, total });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



//****************  CART ********************************/

// Get cart by user ID
const getCartByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  validateMongoDbId(userId);
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { user, product, quantity } = req.body;
  // validateMongoDbId(user);
  // validateMongoDbId(product);
  try {
    let cart = await Cart.findOne({ user });
    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({ user, items: [] });
    }
    // Check if the item already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === product
    );
    if (existingItem) {
      // Update the quantity if the item already exists
      existingItem.quantity += quantity;
    } else {
      // Add new item to the cart
      cart.items.push({ product, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update item quantity in cart
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { user, product, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    // Find the item in the cart and update its quantity
    const item = cart.items.find((item) => item.product.toString() === product);
    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Remove item from cart
const removeCartItem = asyncHandler(async (req, res) => {
  const { user, product } = req.body;
  try {
    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    // Find the item in the cart and remove it
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product
    );
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//USER CART
const userCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { cart } = req.body;
  validateMongoDbId(id);
  try {
    let products = [];
    const user = await User.findById(id);
    const alreadyInCart = await Cart.findOne({ orderby: user.id });
    if (alreadyInCart) {
      alreadyInCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i].id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i].id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price + products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?.id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

//GET USER CART
const getUserCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const cart = await Cart.findOne({ orderby: id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//USER EMPTY CART
const emptyCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const user = await User.findOne({ id });
    const cart = await Cart.findOneAndRemove({ orderby: user.id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
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

  createTransaction,
  getUserTransactions,

  getCartByUserId,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  userCart,
  getUserCart,
  emptyCart,
};