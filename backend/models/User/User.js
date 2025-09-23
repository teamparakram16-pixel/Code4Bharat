import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    googleId: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    profile: {
      fullName: { type: String, default: "" },
      profileImage: { type: String, default: "" },
      age: { type: Number, default: null },
      contactNo: { type: String, default: 0 },
      healthGoal: { type: String, default: "" },
      bio: { type: String, default: "" },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: null,
        required: false,
      },
    },
    successStories: [
      { type: Schema.Types.ObjectId, ref: "SuccessStory", default: [] },
    ],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
    likedPosts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
    verifications: {
      email: {
        type: Boolean,
        default: false,
      },
      completeProfile: {
        type: Boolean,
        default: false,
      },
      contactNo: {
        type: Boolean,
        default: false,
      },
    },

    otpForContact: {
      code: { type: String },
      expiresAt: { type: Date },
      verified: { type: Boolean, default: false },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    sentChatRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "ChatRequest",
      },
    ],
    receivedChatRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "ChatRequest",
      },
    ],
    premiumFeature: {
      premiumOption: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PremiumOption",
        default: null,
      },
      premiumNo: { type: Number, default: 0 },
      validTill: { type: Date, default: null },
      paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
      }, // single payment for this premium feature
    },
    prakritiAnalysis: {
      analysisRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prakrithi",
        ref: "Prakrithi",
        default: null,
      },
      lastAnalyzedAt: {
        type: Date,
        default: null,
      },
    },
  },

  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// Define the model with TypeScript type
const User = mongoose.model("User", userSchema);

export default User;
