const express = require("express");
const { createUser, 
    loginCtrl, 
    getAllUsers, 
    getaUser, 
    deleteaUser, 
    updateaUser, 
    unBlockUser, 
    blockUser } = require("../controller/user.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/register", createUser);
router.post("/login", loginCtrl);
router.get("/getallusers", getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", deleteaUser);
router.put("/edit", authMiddleware, updateaUser); 
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser); 
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser); 


module.exports = router;