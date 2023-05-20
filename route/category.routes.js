const express = require("express");
const { createCategory } = require("../controller/category.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/create-category", createCategory);



module.exports = router;