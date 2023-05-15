//IMPORTING LIBRABRIES FROM OTHER DIRECTORIES
const User = require("../models/user.models");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../../config/jwtToken");
const validateMongoDbId = require("../../utils/validateMongoDbId");
const { generateRefreshToken } = require("../../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./email.controller");
const crypto = require("crypto");

//CREATING A USER
const createUser = asyncHandler( async(req, res) => {
        const email = req.body.email;
        const findUser = await User.findOne({email: email});
        if (!findUser) { 
            const newUser = await User.create(req.body);
            res.json({newUser});
        }
    
        else {
            throw new Error("User Already Exist");
        }
    }
);

//USER LOGIN AND PASSWORD AUTHENTICATION
const loginCtrl =  asyncHandler( async(req, res) => {
    const {email, password} = req.body;

    const findUser = await User.findOne({email: email});
    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser?.id, {
            refreshToken: refreshToken,
        }, 
        {new: true});

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            secure: false,
        });

        res.json({ 
            _id: findUser?._id,
            first_name: findUser?.first_name,
            last_name: findUser?.last_name,
            email: findUser?.email,
            token: generateToken(findUser?._id)
            });
    }
    else {
        throw new Error ("Invalid Credentials");
    }

});

//HANDLE REFRESH TOKEN
const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error ("No Refresh Token in Cookies");

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});


    if(!user) throw new Error ("No Refresh Token present or matched");

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id){
            throw new Error ("There is something wrong with refresh token");
        }
        
        const accessToken = generateToken(user?._id);
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

//GETTING ALL USERS
const getAllUsers = asyncHandler(async(req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)
    } catch (error) {
        throw new Error(error);
    }

});

//GETTING A USER
const getaUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaUser = await User.findById(id);
        res.json({getaUser})
    } catch (error) {
        throw new Error(error);
    }

});

//UPDATE A USER
const updateaUser = asyncHandler(async(req, res) => {
    const {id} = req.user;
    validateMongoDbId(id);
    try {
        const updateaUser = await User.findByIdAndUpdate(id,
            {
                first_name: req?.body?.first_name,
                last_name: req?.body?.last_name,
                email: req?.body?.email,
            }, {
                new: true,
            });
        res.json({updateaUser})
    } catch (error) {
        throw new Error(error);
    }

});

//DELETE A USER
const deleteaUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({deleteaUser})
    } catch (error) {
        throw new Error(error);
    }

});

//BLOCK A USER
const blockUser = asyncHandler(async(req, res) => {
const {id} = req.params;
validateMongoDbId(id);
try {
    const block = await User.findByIdAndUpdate(id, {
        isBlocked: true,
    },
    {
        new: true,
    });
    res.json({
        message: "User blocked",
    });
} catch (error) {
    throw new Error(error);
}
});

//UNBLOCK A USER
const unBlockUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        },
        {
            new: true,
        });
        res.json({
            message: "User unblocked",
        });
    } catch (error) {
        throw new Error(error);
    }
});

//UPDATE PASSWORD
const updatePassword = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

//FORGOT PASSWORD TOKEN
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) throw new Error("User not found with this email address");
    try {
        var token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = "Hi, Please follow this link to reset your password. This link is valid for 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/'" + {token}+ "> Reset Password </a>";
        const data = {
            to: email,
            text: "Hey User",
            subject: "Frogot Password Link",
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
    const user = await User.findOne({
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



module.exports = {
    updateaUser, 
    createUser, 
    loginCtrl, 
    getAllUsers, 
    getaUser, 
    deleteaUser,
    blockUser,
    unBlockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
};