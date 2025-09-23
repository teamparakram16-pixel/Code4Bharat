import mongoose from "mongoose";
const { Schema, model } = mongoose;
const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    senderType: {
      type: String,
      required: true,
      enum: ["User", "Expert"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderType",
    },
    chat: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Chat",
    },
    // roomId: {
    //   type: String,
    //   required: true,
    // },
    // receiverId: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   refPath: "receiverModel",
    // },
    // receiverModel: {
    //   type: String,
    //   required: true,
    //   enum: ["User", "Expert"],
    // },

    // isRead: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
  }
);
const Message = model("Message", messageSchema);
export default Message;
