const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const { post } = require("../routes/postRoutes");
const jwt = require("jsonwebtoken");

exports.createPost = async (req, res) => {
  const { userId, content } = req.body;

  try {
    const authenticateUser = await userModel.findOne({
      _id: userId,
    });
    const userName = authenticateUser.name;
    console.log(userName);
    if (!authenticateUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const post = new postModel({
      userName,
      userId,
      content,
    });

    const response = await post.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "An error occured while creating the post",
      error: error.message,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occured while finding the post",
      error: error.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find();
    if (posts.length === 0) {
      return res.status(404).json({
        success: true,
        data: "no posts found",
      });
    }
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);

    res.status(500).json({
      success: false,
      message: "Server error: Unable to retrieve posts.",
    });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  //   console.log(postId);

  try {
    const post = postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    await postModel.findByIdAndDelete(postId);
    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occured while deleting the post",
      error: error.message,
    });
  }
};

exports.likePost = async (req, res) => {
  const { postId, userToken } = req.body;

  try {
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);

    const userId = decoded.id;
    const currentUser = await userModel.findById(userId);
    console.log(currentUser);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const hasLiked = post.likes.includes(userId);
    if (!hasLiked) {
      post.likes.push(userId);
      await post.save();
      res.status(200).json({
        message: "Liked the post successfully.",
        likes: post.likes.length,
      });
    } else {
      res.status(409).json({ message: "User already liked the post." });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while liking the post.",
      error: error.message,
    });
  }
};

exports.commentPost = async (req, res) => {
  const { text, token, postId } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;
    const currentUser = await userModel.findById(userId);
    console.log(currentUser);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    post.comments.push({
      userId: userId,
      userName: currentUser.name,
      text: text,
      createdAt: new Date(),
    });

    await post.save();

    res.status(200).json({
      message: "Comment added successfully.",
      comments: post.comments,
    });
  } catch (error) {
    console.error("Error commenting on the post:", error);
    res.status(500).json({ message: "Failed to comment on the post." });
  }
};
