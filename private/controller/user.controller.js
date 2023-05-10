const User = require("../Schema/User");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler( async(req, res) => {
        const email = req.body.email;
        const findUser = await User.findOne({email: email});
        if (!findUser) {
            const newUser = await User.create(req.body);
            res.json(newUser);
        }
    
        else {
            throw new Error("User Already Exist");
        }
    }
);

const loginCtrl =  asyncHandler( async(req, res) => {
    const {email, password} = req.body;

    const findUser = await User.findOne({email: email});
    if(findUser && (await findUser.isPasswordMatched(password))){
        res.json(findUser);
    }
    else {
        throw new Error ("Invalid Credentials")
    }

});

module.exports = {createUser, loginCtrl};