const chatModel = require("../models/chatModel");
const User = require("../models/userModel");
const { Types } = require("mongoose");

exports.createChat = async (req, res, next) => {
  const { email1, email2 } = req.body;
  try {
    const currentUser = await User.findOne({ email: email1.toLowerCase() });
    const targetUser = await User.findOne({ email: email2.toLowerCase() });

    const firstId = currentUser._id;
    const secondId = targetUser._id;
    const firstMemberName = currentUser.name;
    const secondMemberName = targetUser.name;

    const chat = await chatModel.findOne({
      $and: [{ "members.userId": firstId }, { "members.userId": secondId }],
    });

    if (chat)
      return res.status(200).json({
        chat: chat,
        message: "chat already exists",
      });

    const newChat = new chatModel({
      members: [
        { userId: firstId, name: firstMemberName },
        { userId: secondId, name: secondMemberName },
      ],
    });

    const response = await newChat.save();
    res.status(200).json(response);
  } catch (error) {
    // console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.findUserChats = async (req, res, next) => {
  const targetUser = req.params.userId;
  try {
    const user = await User.findById(targetUser);
    if (!user) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }
    const chats = await chatModel.find({
      "members.userId": user._id,
    });
    res.status(200).json(chats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const targetUser = await User.findById(secondId);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const chat = await chatModel.findOne({
      "members.userId": {
        $all: [new Types.ObjectId(firstId), new Types.ObjectId(secondId)],
      },
    });

    res.status(200).json({
      chat,
      targetUserDetails: {
        targetUserEmail: targetUser.email,
        targetUserName: targetUser.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
