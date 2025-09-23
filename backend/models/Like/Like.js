import mongoose, { Schema } from "mongoose";
const likeSchema = new mongoose.Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

const Like = mongoose.model("Comment", likeSchema);
export default Like;
