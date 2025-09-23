import express from "express";
import User from "../models/User/User.js";
import { validateUserCompleteProfile } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import completeUserProfileController from "../controllers/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import { checkUserLogin } from "../middlewares/users/auth.js";
import { profileAlreadyCompleted } from "../middlewares/commonAuth.js";
import { handleUserDocumentDiskUpload } from "../middlewares/cloudinary/handleUserDocument/handleUserDocumentsDiskUpload.js";
import { validateUserDocuments } from "../middlewares/users/validationUserDocument.js";
import { parseFormdata } from "../middlewares/cloudinaryMiddleware.js";
import { handleUserDocumentUpload } from "../middlewares/cloudinary/handleUserDocument/handleUserDocumentUpload.js";
import Post from "../models/Post/Post.js";

const router = express.Router();

// // Get user details
// router.get(
//   "/:userId",
//   wrapAsync(async (req, res) => {
//     const user = await User.findById(req.params.userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json(user);
//   })
// );

// // Update user details
// router.put(
//   "/:userId",
//   validateUser,
//   wrapAsync(async (req, res) => {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.userId,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser)
//       return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ message: "Profile updated", user: updatedUser });
//   })
// );

// // Delete user
// router.delete(
//   "/:userId",
//   wrapAsync(async (req, res) => {
//     const deletedUser = await User.findByIdAndDelete(req.params.userId);
//     if (!deletedUser)
//       return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ message: "Profile deleted" });
//   })
// );

router.get(
  "/prakrithi-analysis",
  checkUserLogin,
  wrapAsync(completeUserProfileController.viewPrakrithiAnalysis)
);

router.post(
  "/bookmarks/:postId",
  checkUserLogin,
  wrapAsync(completeUserProfileController.postBookmarks)
);

router.delete(
  "/bookmarks/:postId",
  checkUserLogin,
  wrapAsync(completeUserProfileController.removeBookmarks)
);

// This is for adding to like posts list of user
router.post(
  "/liked-posts/:postId",
  checkUserLogin,
  wrapAsync(completeUserProfileController.likePosts)
);

// This is for removing posts from like list of user
router.delete(
  "/liked-posts/:postId",
  checkUserLogin,
  wrapAsync(completeUserProfileController.disLikePosts)
);

router.patch(
  "/change-password",
  checkUserLogin,
  wrapAsync(completeUserProfileController.changePassword)
);

// This is for getting all like post list of user
router.get(
  "/liked-posts",
  checkUserLogin,
  wrapAsync(completeUserProfileController.getAllLikedPosts)
);

router.get(
  "/bookmarks",
  checkUserLogin,
  wrapAsync(completeUserProfileController.getBookmarks)
);

// const express = require("express");
// const User = require("../models/User");
// const Post = require("../models/Post");
// const wrapAsync = require("../utils/wrapAsync");

// // Remove bookmark
// router.delete(
//   "/bookmark/:postId",
//   wrapAsync(async (req, res) => {
//     const { postId } = req.params;

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { $pull: { bookmarks: postId } }, // ✅ Using $pull operator
//       { new: true }
//     );

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res
//       .status(200)
//       .json({
//         message: "Post removed from bookmarks",
//         bookmarks: user.bookmarks,
//       });
//   })
// );

// Create a new user
router.get(
  "/posts",
  checkUserLogin,
  wrapAsync(completeUserProfileController.getUserSuccessStories)
);
router.patch(
  "/complete-profile",
  checkUserLogin,
  handleUserDocumentDiskUpload, // multer disk upload for user docs
  validateUserDocuments, // validate required user docs
  parseFormdata, // parse form data if needed
  validateUserCompleteProfile, // zod validation for user profile
  wrapAsync(handleUserDocumentUpload), // upload user docs to cloudinary
  wrapAsync(completeUserProfileController.completeProfile)
);
router.get(
  "/user-profile",
  checkUserLogin,
  wrapAsync(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Extract only required fields
    const filteredUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profile: {
        fullName: user.profile?.fullName || "",
        profileImage: user.profile?.profileImage || "",
        contactNo: user.profile?.contactNo || "",
        healthGoal: user.profile?.healthGoal || "",
        gender: user.profile?.gender || "",
        age: user.profile?.age ?? null,
        bio: user.profile?.bio || "",
      },
      verifications: user.verifications,
      role: user.role,
      premiumUser: user.premiumUser,
    };

    res.status(200).json({ success: true, user: filteredUser });
  })
);

// PATCH : Update User Details
router.patch(
  "/update-profile",
  checkUserLogin,
  wrapAsync(completeUserProfileController.updateProfile)
);

// Post : Send user information about the chat request from another user
router.post(
  "/chat-request",
  checkUserLogin,
  wrapAsync(completeUserProfileController.sendchatacceptinfo)
);

// GET : To get user details for profile
router.get(
  "/user-profile",
  checkUserLogin,
  wrapAsync(completeUserProfileController.getUserProfile)
);

// Get user details
router.get(
  "/:id",
  checkUserLogin,
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  })
);

// Update user details
router.put(
  "/edit/:id",
  wrapAsync(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  })
);

export default router;
