import User from "../models/User/User.js";
import Post from "../models/Post/Post.js";
import SuccessStory from "../models/SuccessStory/SuccessStory.js";
import Routine from "../models/Routines/Routines.js";
import { sendChatInfoEmail } from "../utils/sendChatAcceptInfoEmail.js";

export const searchUsers = async (req, res) => {
  const { q: searchQuery } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const users = await User.find({
    username: new RegExp(searchQuery, "i"),
  }).select("_id username profile.profileImage");

  res.status(200).json({
    message: "Search results",
    success: true,
    users: users,
    userId: req.user._id,
  });
};

import { z } from "zod";
import ExpressError from "../utils/expressError.js";

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const userSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  contactNo: z.string().min(10).max(15),
  email: z.string().email().optional().or(z.literal("")),
  currentCity: z.string().min(1, "Current city is required"),
  state: z.string().min(1, "State is required"),
  healthGoal: z.string().min(1, "Primary wellness goal is required"),
  consent: z.boolean(),
});

export const completeProfile = async (req, res) => {
  try {
    // Expecting multipart/form-data with userProfile (JSON) and files
    const userId = req.user._id;
    const { userProfile } = req.body;
    let profileData;
    try {
      profileData =
        typeof userProfile === "string" ? JSON.parse(userProfile) : userProfile;
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userProfile JSON" });
    }

    // Validate profile data
    const parseResult = userSchema.safeParse(profileData);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.errors,
      });
    }

    // Handle file uploads (governmentId, profilePicture)
    let governmentIdUrl = req.governmentIdUrl || null;
    let profilePictureUrl = req.profilePictureUrl || null;
    // If using multer, these should be set by middleware

    // Build update object
    const updates = {
      "profile.fullName": profileData.fullName,
      "profile.gender": profileData.gender,
      "profile.dateOfBirth": profileData.dateOfBirth,
      "profile.contactNo": profileData.contactNo,
      "profile.email": profileData.email,
      "profile.currentCity": profileData.currentCity,
      "profile.state": profileData.state,
      "profile.healthGoal": profileData.healthGoal,
      "profile.consent": profileData.consent,
      "profile.profilePicture": profilePictureUrl,
      "profile.governmentId": governmentIdUrl,
      "verifications.completeProfile": true,
    };

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const UserId = req.user?._id;
    if (!UserId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const user = await User.findById(UserId).select(
      "-resetPasswordToken -resetPasswordExpires -__v"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Get User Bookmarked Posts
// GET /bookmarks

const getBookmarks = async (req, res) => {
  const user = await User.findById(req.user._id).populate("bookmarks");
  if (!user) {
    return res.status(400).json({
      message: "User not Found !",
    });
  }
  res.status(200).json({ bookmarks: user.bookmarks });
};

// Posting Bookmarks
// POST /bookmarks/:postId

const postBookmarks = async (req, res) => {
  const { postId } = req.params;
  const user_Id = req.user._id;

  const user = await User.findById(user_Id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const post = await Post.findById(postId);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (user.bookmarks.includes(postId)) {
    return res.status(400).json({ message: "Post already bookmarked" });
  }

  user.bookmarks.push(postId);
  await user.save();

  res.status(200).json({
    message: "Post bookmarked successfully",
    bookmarks: user.bookmarks,
  });
};

const removeBookmarks = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not Found !" });

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not Found !" });

  user.bookmarks = user.bookmarks.filter(
    (bookmarkId) => bookmarkId.toString() !== postId
  );

  await user.save();
  res.status(200).json({
    message: "Post bookmark removed successfully",
    bookmarks: user.bookmarks,
  });
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not Found !" });

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new passwords are required." });
    }

    if (oldPassword === newPassword)
      return res
        .status(400)
        .json({ message: "New password cannot be same as old password!" });

    user.changePassword(oldPassword, newPassword, async (err) => {
      if (err) {
        return res.status(400).json({
          message: "Old password is incorrect or password update failed.",
          error: err.message,
        });
      }
      await user.save();
      res.status(200).json({ message: "Password changed successfully!" });
    });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      newfullName,
      newphoneNumber,
      newhealthGoal,
      newGender,
      newAge,
      newBio,
    } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not Found !" });

    if (
      !newfullName ||
      !newphoneNumber ||
      !newhealthGoal ||
      !newGender ||
      !newAge ||
      !newBio
    )
      return res
        .status(400)
        .json({ message: "Kindly fill all the details correctly" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        "profile.fullName": newfullName,
        "profile.contactNo": newphoneNumber,
        "profile.healthGoal": newhealthGoal,
        "profile.gender": newGender,
        "profile.age": newAge,
        "profile.bio": newBio,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found!" });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllLikedPosts = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate({
    path: "likedPosts",
    populate: {
      path: "owner",
      select: "_id profile.fullName profile.profileImage",
    },
  });

  if (!user) return res.status(400).json({ message: "User not Found !" });

  return res.status(200).json({
    Message: "All Liked Posts fetched",
    likedPosts: user.likedPosts,
  });
};

const likePosts = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not Found !" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not Found !" });

    if (user.likedPosts.includes(postId))
      return res.status(400).json({
        message: "Post already Liked ! You can only like a post only once .",
      });

    user.likedPosts.push(postId);
    post.likesCount += 1;

    await user.save();
    await post.save();

    res.status(200).json({ message: "Post liked successfully!" });
  } catch (error) {
    console.log("Error liking Post : ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const disLikePosts = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not Found !" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not Found !" });

    if (!user.likedPosts.includes(postId)) {
      return res
        .status(400)
        .json({ message: "You have not liked this post yet!" });
    }

    user.likedPosts = user.likedPosts.filter(
      (dislikeId) => dislikeId.toString() !== postId.toString()
    );

    post.likesCount = Math.max(0, post.likesCount - 1); // Here it prevents negative value for likes

    await user.save();
    await post.save();

    res.status(200).json({ message: "Post like removed successfully!" });
  } catch (error) {
    console.log("Error removing like from the  Post : ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendchatacceptinfo = async (req, res) => {
  try {
    const senderName = req.user.username;
    const senderEmail = req.user.email;
    const { percentagematch, recieverEmail } = req.body;
    if (!percentagematch || !recieverEmail)
      return res
        .status(400)
        .json({ message: "Fill all the details correctly !" });

    const response = await sendChatInfoEmail(
      senderName,
      senderEmail,
      percentagematch,
      recieverEmail
    );
    if (!response)
      return res.status(400).json({ message: "Error in sending email !" });

    return res.status(200).json({
      response: response,
      message: "Email sent successfully to the reciever.",
    });
  } catch (error) {
    console.log("Error sending email to the reciever !");
  }
};

const viewPrakrithiAnalysis = async (req, res) => {
  // Assuming you have a Prakriti model and user stores a reference to it
  const prakrithiAnalysis = req.user.prakritiAnalysis;
  if (!prakrithiAnalysis) {
    return next(new ExpressError(404, "Prakrithi Analysis not found"));
  }
  res.status(200).json({ success: true, prakrithiAnalysis });
};

// Export or add to your controller object
export default {
  searchUsers,
  completeProfile,
  getUserProfile,
  getBookmarks,
  postBookmarks,
  removeBookmarks,
  changePassword,
  updateProfile,
  getAllLikedPosts,
  likePosts,
  disLikePosts,
  sendchatacceptinfo,
  viewPrakrithiAnalysis,
};
