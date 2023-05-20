const express = require("express");
const {
    authMiddleware,
    isAdmin } = require("../middlewares/authMiddleware");
const { 
    createBlog, 
    updateBlog, 
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog, 
    dislikeBlog, } = require("../controller/blog.controller");
const router = express.Router();


router.post("/create-blog", authMiddleware, isAdmin, createBlog);
router.put("/like", authMiddleware, likeBlog);
router.put("/dislike", authMiddleware, dislikeBlog);
router.put("/update-blog/:id", authMiddleware, isAdmin, updateBlog);
router.get("/get-blog/:id", getBlog);
router.get("/get-all-blog", getAllBlogs);
router.delete("/delete-blog/:id", authMiddleware, isAdmin, deleteBlog);

//router.get("/:id", authMiddleware, isAdmin, getaUser);



module.exports = router;