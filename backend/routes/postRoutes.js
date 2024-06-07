const express = require("express");
const postController = require("../controllers/postsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/", authController.protect, postController.createPost);
router.post("/likePost", authController.protect, postController.likePost);
router.post("/comment", authController.protect, postController.commentPost);
router.post("/getPost/:postId", postController.getPost);
router.get("/getPosts", postController.getAllPosts);
router.delete("/:postId", authController.protect, postController.deletePost);

module.exports = router;
