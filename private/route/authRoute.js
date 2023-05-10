const express = require("express");
const { createUser, loginCtrl, getAllUsers } = require("../controller/user.controller");
const router = express.Router();


router.post("/register", createUser);
router.post("/login", loginCtrl);
router.get("/getallusers", getAllUsers);


module.exports = router;