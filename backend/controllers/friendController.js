const User = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.sendFriendRequest = async (req, res, next) => {
  console.log(req.body);
  const { token, email } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;
    const currentUser = await User.findById(userId);
    const targetUser = await User.findOne({ email: email.toLowerCase() });

    if (!targetUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (!currentUser.friends.includes(targetUser.email)) {
      if (!currentUser.sentFriendRequests.includes(targetUser.email)) {
        currentUser.sentFriendRequests.push(targetUser.email);
        targetUser.acceptFriendRequests.push(currentUser.email);

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({
          status: "success",
          message: "Friend request sent.",
        });
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "Friend request already sent." });
      }
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Already friends." });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

exports.viewFriendRequests = async (req, res, next) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const acceptFriendRequests = currentUser.acceptFriendRequests;

    return res.status(200).json({ status: "success", acceptFriendRequests });
  } catch (error) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};
