const express = require("express");
const authController = require("../controllers/authController");
const friendController = require("../controllers/friendController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/getUser", authController.getUser);
router.post("/follow", authController.protect, authController.follow);
router.post(
  "/sendFriendRequest",
  authController.protect,
  friendController.sendFriendRequest
);
router.post("/viewFriendRequests", friendController.viewFriendRequests);

module.exports = router;
