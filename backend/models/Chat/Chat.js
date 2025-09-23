// models/Chat.js
import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    participants: [
      {
        user: {
          type: Schema.Types.ObjectId,
          required: true,
          refPath: "participants.userType",
        },
        userType: {
          type: String,
          required: true,
          enum: ["User", "Expert"],
        },
      },
    ],
    groupChat: {
      type: Boolean,
      required: true,
      default: false,
    },
    groupChatName: {
      type: String,
      default: "",
    },
    ownerType: {
      type: String,
      default: null,
      enum: ["User", "Expert"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      refPath: "ownerType",
      default: null,
    },
    chatRequest: {
      type: Schema.Types.ObjectId,
      ref: "ChatRequest",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
