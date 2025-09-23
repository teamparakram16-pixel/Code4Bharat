import Chat from "../models/Chat/Chat.js";
import Message from "../models/Message/Message.js";
import ExpressError from "../utils/expressError.js";
import User from "../models/User/User.js";
import Expert from "../models/Expert/Expert.js";
import calculateSimilarPrakrithiUsers from "../utils/similarPkUsers.js";
import Prakrithi from "../models/Prakrathi/Prakrathi.js";
import ChatRequest from "../models/ChatRequest/ChatRequest.js";
import linkChatToUsers from "../utils/linkChatToUsers.js";
import path from "path";

export const getChatMessages = async (req, res) => {
  const chatId = req.params.id;
  const chat = req.chat;

  // Fetch all messages between the two users
  const messages = await Message.find({ chat: chatId })
    .select("-chat")
    .sort({ createdAt: 1 })
    .populate("sender", "_id profile.fullName profile.profilePicture");

  const currUser = {
    _id: req.user._id,
    profile: {
      fullName: req.user.profile.fullName,
      profileImage: req.user.profile.profileImage,
    },
  };


  res.status(200).json({
    success: true,
    messages,
    chatInfo: chat,
    currUser,
  });
};

// 1. Create a chat request
export const createChatRequest = async (req, res) => {
  const { chatType, groupName, users, chatReason } = req.body;
  const ownerId = req.user._id;
  const ownerType = req.user.role === "expert" ? "Expert" : "User";

  // Fetch Prakrithi data for all users (including owner)
  const allUserIds = [ownerId, ...users.map((u) => u.user)];
  const prakrithiDocs = await Prakrithi.find({
    user: { $in: allUserIds },
  }).populate("user");
  const prakrithiMap = {};
  prakrithiDocs.forEach((doc) => {
    prakrithiMap[doc.user._id.toString()] = doc;
  });

  const currUserPk = prakrithiMap[ownerId.toString()];

  // Prepare users array with similarity calculation if needed
  const preparedUsers = users.map((u) => {
    let similarPrakrithiPercenatge = null;
    if (chatReason && chatReason.similarPrakrithi) {
      const otherUserPk = prakrithiMap[u.user.toString()];
      if (currUserPk && otherUserPk) {
        const fieldsToCompare = [
          "Body_Type",
          "Skin_Type",
          "Hair_Type",
          "Facial_Structure",
          "Complexion",
          "Eyes",
          "Food_Preference",
          "Bowel_Movement",
          "Thirst_Level",
          "Sleep_Quality",
          "Energy_Levels",
          "Daily_Activity_Level",
          "Exercise_Routine",
          "Food_Habit",
          "Water_Intake",
          "Health_Issues",
          "Hormonal_Imbalance",
          "Skin_Hair_Problems",
          "Ayurvedic_Treatment",
        ];
        const result = calculateSimilarPrakrithiUsers(
          currUserPk,
          [otherUserPk],
          fieldsToCompare
        );
        similarPrakrithiPercenatge = result[0]?.similarityPercentage ?? null;
      }
    }
    return {
      ...u,
      status: "pending",
      similarPrakrithiPercenatge,
    };
  });

  // Create the ChatRequest document
  const chatRequest = await ChatRequest.create({
    ownerType,
    owner: ownerId,
    users: preparedUsers,
    chatType,
    groupName: chatType === "group" ? groupName : null,
    chatReason: chatReason || {},
  });

  // Reference this ChatRequest in each user's sent/receivedChatRequests
  for (const u of preparedUsers) {
    const Model = u.userType === "Expert" ? Expert : User;
    // Add to receivedChatRequests for each participant
    await Model.findByIdAndUpdate(u.user, {
      $push: { receivedChatRequests: chatRequest._id },
    });
  }
  // Add to owner's sentChatRequests
  const OwnerModel = ownerType === "Expert" ? Expert : User;
  await OwnerModel.findByIdAndUpdate(ownerId, {
    $push: { sentChatRequests: chatRequest._id },
  });

  res.status(201).json({ success: true, chatRequest });
};

// Controller: Accept a chat request and create or update chat accordingly
export const acceptChatRequest = async (req, res) => {
  const chatRequestId = req.params.id;
  const receiverId = req.user._id;
  const receiverType = req.user.role === "expert" ? "Expert" : "User";

  // 1. Find the chat request by ID
  const chatRequest = await ChatRequest.findById(chatRequestId).populate(
    "owner"
  );
  if (!chatRequest) throw new ExpressError(404, "Chat request not found");

  // 2. Mark the current user’s status as "accepted" in the chatRequest
  chatRequest.users = chatRequest.users.map((u) =>
    u.user.toString() === receiverId.toString()
      ? { ...u.toObject(), status: "accepted" }
      : u
  );
  await chatRequest.save();

  // 3. Filter users who have accepted the chat request
  const acceptedUsers = chatRequest.users.filter(
    (u) => u.status === "accepted"
  );

  let chat = null;

  // 4. Handle group chat creation or update
  if (chatRequest.chatType === "group") {
    if (acceptedUsers.length === 2) {
      // 4a. First two accepted users trigger group chat creation

      const participants = [
        ...acceptedUsers.map((u) => ({ user: u.user, userType: u.userType })),
        { user: chatRequest.owner._id, userType: chatRequest.ownerType },
      ];

      chat = await Chat.create({
        participants,
        groupChat: true,
        groupChatName: chatRequest.groupName || "",
        owner: chatRequest.owner._id,
        ownerType: chatRequest.ownerType,
        chatRequest: chatRequest._id,
      });

      // Link chat to users and owner
      await linkChatToUsers(chat, participants);

      chatRequest.chat = chat._id;
      await chatRequest.save();
    } else if (acceptedUsers.length > 2) {
      // 4b. More users are joining an existing group chat

      chat = await Chat.findById(chatRequest.chat);

      if (chat) {
        // Add current user to participants if not already present
        const alreadyInChat = chat.participants.some(
          (p) => p.user.toString() === receiverId.toString()
        );

        if (!alreadyInChat) {
          chat.participants.push({ user: receiverId, userType: receiverType });
          await chat.save();
        }

        // Add chat reference to user's profile
        await linkChatToUsers(chat, [
          {
            user: receiverId,
            userType: receiverType,
          },
        ]);
      } else {
        // Fallback: Recreate the group chat if it was deleted or not yet created

        const participants = [
          ...acceptedUsers.map((u) => ({ user: u.user, userType: u.userType })),
          { user: chatRequest.owner._id, userType: chatRequest.ownerType },
        ];

        chat = await Chat.create({
          participants,
          groupChat: true,
          groupChatName: chatRequest.groupName || "",
          owner: chatRequest.owner._id,
          ownerType: chatRequest.ownerType,
          chatRequest: chatRequest._id,
        });

        await linkChatToUsers(chat, participants);

        chatRequest.chat = chat._id;
        await chatRequest.save();
      }
    }
  } else {
    // 5. Handle private chat (1-to-1)
    if (acceptedUsers.length === 1) {
      const participants = [
        ...acceptedUsers.map((u) => ({ user: u.user, userType: u.userType })),
        { user: chatRequest.owner._id, userType: chatRequest.ownerType },
      ];

      chat = await Chat.create({
        participants,
        groupChat: false,
        groupChatName: "",
        chatRequest: chatRequest._id,
      });

      await linkChatToUsers(chat, participants);

      chatRequest.chat = chat._id;
      await chatRequest.save();
    }
  }

  // 6. Respond to the client with success and chat info
  res.status(201).json({
    success: true,
    message:
      "Chat request accepted" +
      (chat ? ", chat created/updated" : ", waiting for more users to accept"),
    chat: chat._id || null,
  });
};

// 3. Reject chat request
export const rejectChatRequest = async (req, res) => {
  const chatRequestId = req.params.id;
  const receiverId = req.user._id;

  // Find the chat request
  const chatRequest = await ChatRequest.findById(chatRequestId);
  if (!chatRequest) {
    throw new ExpressError(404, "Chat request not found");
  }

  // Update status for this user in the chatRequest users array
  chatRequest.users = chatRequest.users.map((u) =>
    u.user.toString() === receiverId.toString()
      ? { ...u.toObject(), status: "rejected" }
      : u
  );
  await chatRequest.save();

  res.status(200).json({ success: true, message: "Chat request rejected" });
};

// Unified controller for sent chat requests (all or filtered by type)
export const getSentChatRequests = async (req, res) => {
  const userId = req.user._id;
  const type = req.query.type; // 'private' or 'group' or undefined
  const userType = req.user.role === "expert" ? "Expert" : "User";
  const Model = userType === "Expert" ? Expert : User;
  const user = await Model.findById(userId)
    .select("sentChatRequests")
    .populate({
      path: "sentChatRequests",
      match: type ? { chatType: type } : {},
      populate: {
        path: "users.user",
        select: "_id profile.fullName profile.profileImage",
      },
    });
  res.status(200).json({
    success: true,
    sentChatRequests: user.sentChatRequests,
    currUser: req.user._id.toString(),
  });
};

// Unified controller for received chat requests (all or filtered by type)
export const getReceivedChatRequests = async (req, res) => {
  const userId = req.user._id;
  const type = req.query.type; // 'private' or 'group' or undefined
  const userType = req.user.role === "expert" ? "Expert" : "User";
  const Model = userType === "Expert" ? Expert : User;
  const user = await Model.findById(userId).populate({
    path: "receivedChatRequests",
    match: type ? { chatType: type } : {},
    populate: {
      path: "owner users.user",
      select: "_id profile.fullName profile.profileImage",
    },
  });
  res.status(200).json({
    success: true,
    receivedChatRequests: user.receivedChatRequests,
    currUser: req.user._id.toString(),
  });
};

// Controller: Fetch all chats for the current user (from user's/expert's 'chats' field)
export const getMyChats = async (req, res) => {
  const userId = req.user._id;
  const userType = req.user.role === "expert" ? "Expert" : "User";
  const Model = userType === "Expert" ? Expert : User;
  // Fetch the user/expert with their chats array, and deeply populate all relevant fields
  const userDoc = await Model.findById(userId).populate({
    path: "chats",
    populate: [
      // Populate each participant's user profile (name, image)
      {
        path: "participants.user",
        select: "_id profile.fullName profile.profileImage",
      },
      // Populate the latest message and its sender's profile
      {
        path: "latestMessage",
        select: "content createdAt sender",
        populate: {
          path: "sender",
          select: "_id profile.fullName profile.profileImage",
        },
      },
      // Populate the owner of the chat (for group chats)
      {
        path: "owner",
        select: "_id profile.fullName profile.profileImage",
      },
      // Populate the chatRequest, including users and owner
      {
        path: "chatRequest",
        select: "users chatReason owner",
        populate:
          // Populate each user in the chatRequest
          {
            path: "users.user",
            select: "_id profile.fullName profile.profileImage",
          },
      },
    ],
    options: { sort: { updatedAt: -1 } },
  });

  // 🧠 Populate chatRequest.owner with correct model using refPath
  await Chat.populate(userDoc.chats, {
    path: "chatRequest.owner",
    select: "_id profile.fullName profile.profileImage",
  });
  const chats = userDoc?.chats || [];
  res.status(200).json({
    success: true,
    chats,
    currUser: req.user._id.toString(),
  });
};

export default {
  getChatMessages,
  createChatRequest,
  acceptChatRequest,
  rejectChatRequest,
  getSentChatRequests,
  getReceivedChatRequests,
  getMyChats,
};
