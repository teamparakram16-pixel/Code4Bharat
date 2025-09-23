import Chat from "../models/Chat/Chat.js";
import User from "../models/User/User.js";
import ExpressError from "../utils/expressError.js";
import mongoose from "mongoose";
import ChatRequest from "../models/ChatRequest/ChatRequest.js";
import Expert from "../models/Expert/Expert.js";

export const checkChatOwnership = async (req, res, next) => {
  const chatId = req.params.id;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new ExpressError(400, "Invalid chat id");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: { $elemMatch: { user: userId } },
  }).populate("participants.user", "_id profile.fullName profile.profileImage").populate("owner", "_id profile.fullName profile.profileImage");

  if (!chat) {
    throw new ExpressError(403, "Chat not found or unauthorized access");
  }

  // chat.participants = chat.participants.filter(
  //   (participant) => participant.user._id.toString() !== req.user._id.toString()
  // );

  // Attach chat to request
  req.chat = chat;

  next();
};

export const checkIncludesCurrChatUser = (req, res, next) => {
  const { participants } = req.body;

  const userIds = participants?.map((eachParticipant) => eachParticipant.user);
  const currUserId = req.user?._id;

  if (userIds.includes(currUserId)) {
    throw new ExpressError(400, "You cannot chat with yourself");
  }
  next();
};

export const checkChatUsersExists = async (req, res, next) => {
  const { users } = req.body;

  await Promise.all(
    users.map(async (user) => {
      const userId = user.user;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ExpressError(400, `Invalid user ID: ${userId}`);
      }
      const Model = user.userType === "Expert" ? Expert : User;
      const foundUser = await Model.findById(userId);

      if (!foundUser) {
        throw new ExpressError(404, `User with ID ${userId} does not exist`);
      }
    })
  );
  next();
};

export const checkUserInChatRequest = async (req, res, next) => {
  const chatRequestId = req.params.id;
  const currUserId = req.user._id.toString();
  const chatRequest = await ChatRequest.findById(chatRequestId);
  if (!chatRequest) {
    throw new ExpressError(404, "Chat request not found");
  }
  const isUserInRequest = chatRequest.users.some(
    (u) => u.user.toString() === currUserId
  );
  if (!isUserInRequest) {
    throw new ExpressError(
      403,
      "You are not a participant in this chat request"
    );
  }
  next();
};

// Middleware to check if a private chat request already exists between owner and a single user
export const checkDuplicatePrivateChatRequest = async (req, res, next) => {
  const { chatType, users } = req.body;
  if (chatType !== "private" || !Array.isArray(users) || users.length !== 1) {
    return next(); // Only applies to private chat requests
  }

  const currUserId = req.user._id.toString(); // owner
  const otherUserId = users[0].user;

  // Find any existing private chat request where owner is currUserId and users[0].user is otherUserId
  const existingRequest = await ChatRequest.findOne({
    chatType: "private",
    owner: { $in: [currUserId, otherUserId] },
    "users.user": { $in: [currUserId, otherUserId] },
    $or: [{ "users.status": "pending" }, { "users.status": "accepted" }],
  });

  if (existingRequest) {
    throw new ExpressError(
      409,
      "A private chat request to this user already exists and is pending or accepted."
    );
  }
  next();
};

// Middleware to check if a group chat with the same name already exists
export const checkDuplicateGroupChatName = async (req, res, next) => {
  const { chatType, groupName } = req.body;
  if (chatType !== "group" || !groupName) {
    return next(); // Only applies to group chat requests
  }
  // Check for existing group chat with the same name (case-insensitive)
  const existingGroup = await ChatRequest.findOne({
    chatType: "group",
    groupName: { $regex: new RegExp(`^${groupName.trim()}$`, "i") },
  });
  if (existingGroup) {
    throw new ExpressError(
      409,
      "A group chat with this name already exists and is pending or active."
    );
  }
  next();
};

// Middleware to check if user has already accepted or rejected the chat request
export const checkNotAlreadyRespondedToChatRequest = async (req, res, next) => {
  const chatRequestId = req.params.id;
  const currUserId = req.user._id.toString();
  const chatRequest = await ChatRequest.findById(chatRequestId);
  if (!chatRequest) {
    throw new ExpressError(404, "Chat request not found");
  }
  const userEntry = chatRequest.users.find(
    (u) => u.user.toString() === currUserId
  );
  if (userEntry.status === "accepted") {
    throw new ExpressError(409, "You have already accepted this chat request.");
  }
  if (userEntry.status === "rejected") {
    throw new ExpressError(409, "You have already rejected this chat request.");
  }
  next();
};
