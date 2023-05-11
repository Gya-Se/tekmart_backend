const express = require("express");
const { createUser, loginCtrl, getAllUsers, getaUser, deleteaUser, updateaUser } = require("../controller/user.controller");
const router = express.Router();


router.post("/register", createUser);
router.post("/login", loginCtrl);
router.get("/getallusers", getAllUsers);
router.get("/:id", getaUser);
router.delete("/:id", deleteaUser);
router.put("/:id", updateaUser);


module.exports = router;