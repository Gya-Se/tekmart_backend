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
    saveAndUpdateAddress,
    updateAvatar,} = require("../controller/user.controller");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multer");
const router = express.Router();

//POST ROUTE
router.post("/register", createUser);
router.post("/login", userLogin);
router.post("/forgot-password-token", forgotPasswordToken);

//GET ROUTE
router.get("/refresh", handleRefreshToken); 
router.get("/logout", logout); 

//DELETE ROUTE
router.delete("/delete-user", authenticateUser, deleteUser); 

//PUT ROUTE
router.put("/update-user", authenticateUser, updateUser); 
router.put("/update-address", authenticateUser, saveAndUpdateAddress);
router.put("/update-avatar", authenticateUser,   upload.single("image"), updateAvatar);
router.put("/update-password", authenticateUser, updatePassword);
router.put("/reset-password/:token", authenticateUser, resetPassword);

//EXPORT ROUTE
module.exports = router;