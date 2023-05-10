const express = require("express");
const { createUser, loginCtrl } = require("../controller/user.controller");
const router = express.Router();


router.post("/register", createUser);
router.post("/login", loginCtrl);
module.exports = router;