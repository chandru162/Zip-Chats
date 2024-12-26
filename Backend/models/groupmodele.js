// server/models/Group.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true },
    members: [
      { type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }
      ],
    admin: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    groupPicture: { 
      type: String, 
      default: "" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
