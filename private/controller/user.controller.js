//IMPORTING LIBRABRIES FROM OTHER DIRECTORIES
const User = require("../Schema/User");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../service/jwtToken");


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
    console.log(id);

})




module.exports = {createUser, loginCtrl, getAllUsers};