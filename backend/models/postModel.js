const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userName: String,
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    content: String,
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    comments: [
      {
        userId: { type: mongoose.Schema.ObjectId, ref: "User" },
        userName: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.model("Posts", postSchema);

module.exports = postModel;
