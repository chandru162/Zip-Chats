// server/models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // For one-to-one
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    }, // For group chat
    content: {
      type: String,
    },
    media: {
      type: String,
    }, // URL to uploaded media
    type: {
      type: String,
      enum: ["text", "image", "video", "document", "location"],
      default: "text",
    },
    // Add encryption fields if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
