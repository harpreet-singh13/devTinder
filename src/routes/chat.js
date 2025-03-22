const express = require("express");
const chatRouter = express.Router();
const Chat = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.targetUserId;

    let chat = await Chat.findOne({
      particpants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        particpants: [userId, targetUserId],
        messages: [],
      });

      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error(err);
  }
});

module.exports = chatRouter;
