import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    media: {
      images: {
        type: [String],
        validate: [
          {
            validator: function (val) {
              return val.length <= 3;
            },
            message: "You can upload a maximum of 3 images.",
          },
        ],
      },
      video: { type: String, default: null },
      document: { type: String, default: null },
    },
    filters: { type: [String], required: true },
    readTime: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
export default Post;
