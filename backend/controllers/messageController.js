const messageModel = require("../models/messageModel");
const chatModel = require("../models/chatModel");

exports.createMessage = async (req, res, next) => {
  const { chatId, senderId, text } = req.body;

  try {
    const authenticateChatId = await chatModel.findOne({ _id: chatId });
    if (!authenticateChatId) {
      return res.status(404).json({ message: "Chat ID not found" });
    }

    const message = new messageModel({
      chatId,
      senderId,
      text,
    });

    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the message",
      error: error.message,
    });
  }
};

exports.getMessage = async (req, res, next) => {
  const { chatId } = req.params;

  // Optionally validate chatId here. For example:
  if (!chatId) {
    return res.status(400).json({ message: "Chat ID must be provided" });
  }

  try {
    const messages = await messageModel.find({ chatId });

    if (messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for the provided Chat ID" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving messages" });
  }
};
