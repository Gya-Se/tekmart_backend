const Vendor = require("../models/vendor.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authenticateUser = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        }
        catch (error) {
            throw new Error("Not authorized token expired, please login again");
        }
    } else {
        throw new Error("There is no token attached to header");
    }
});

const authenticateVendor = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await Vendor.findById(decoded?.id);
                req.user = user;
                next();
            }
        }
        catch (error) {
            throw new Error("Not authorized token expired, please login again");
        }
    } else {
        throw new Error("There is no token attached to header");
    }
});


const isAdmin = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    try {
        if (id.role === "admin") {
            next();
        }
        else {
            throw new Error("You are not an admin");
        }
    } catch (error) {
        throw new Error(error)
    }
})
module.exports = { authenticateUser, authenticateVendor, isAdmin };