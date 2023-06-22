//IMPORTING METHODS FROM DIRECTORIES TO ROUTE
const express = require("express");
const {
    createUser, 
    userLogin,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    updateUser,
    handleRefreshToken,
    logout,
    deleteUser,
    updateAddress,
    updateAvatar,
    getUser,
    deleteAddress,
    activateUser,} = require("../controller/user.controller");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multer");
const router = express.Router();

//POST ROUTE
router.post("/register", createUser);
router.post("/activation", activateUser);
router.post("/login", userLogin);
router.post("/forgot-password-token", forgotPasswordToken);

//GET ROUTE
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout); 
router.get("/get-user", authenticateUser, getUser);

//DELETE ROUTE
router.delete("/delete-user", authenticateUser, deleteUser); 

//PUT ROUTE
router.put("/update-user", authenticateUser, updateUser); 
router.put("/update-address", authenticateUser, updateAddress);
router.put("/delete-address", authenticateUser, deleteAddress);
router.put("/update-avatar", authenticateUser,   upload.single("image"), updateAvatar);
router.put("/update-password", authenticateUser, updatePassword);
router.put("/reset-password/:token", authenticateUser, resetPassword);

//EXPORT ROUTE
module.exports = router;