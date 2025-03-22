const moongoose = require("mongoose");

const messageSchema = new moongoose.Schema(
  {
    senderId: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new moongoose.Schema({
  particpants: [
    {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [messageSchema],
});

module.exports = moongoose.model("Chat", chatSchema);
