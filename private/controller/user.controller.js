//IMPORTING LIBRABRIES FROM OTHER DIRECTORIES
const User = require("../models/user.models");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../../config/jwtToken");
const validateMongoDbId = require("../../utils/validateMongoDbId");


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


module.exports = {
    updateaUser, 
    createUser, 
    loginCtrl, 
    getAllUsers, 
    getaUser, 
    deleteaUser,
    blockUser,
    unBlockUser
};