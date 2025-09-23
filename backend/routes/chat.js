import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import {
  checkChatOwnership,
  checkChatUsersExists,
  checkDuplicatePrivateChatRequest,
  checkDuplicateGroupChatName,
  checkIncludesCurrChatUser,
  checkUserInChatRequest,
  checkNotAlreadyRespondedToChatRequest,
} from "../middlewares/chat.js";
import chatController from "../controllers/chat.js";
import {
  validateChatUsersIds,
  validateChatRequest,
  checkChatRequestDoesNotContainCurrentUser,
} from "../middlewares/validationMiddleware/validationMiddlewares.js";
import { checkSimilarPrakrithiPremium } from "../middlewares/premium/checkSimilarPkPremium.js";

const router = express.Router();

// Create a new chat
// router.post(
//   "/",
//   isLoggedIn,
//   validateChatUsersIds,
//   checkIncludesCurrChatUser,
//   wrapAsync(checkChatUsersExists),
//   wrapAsync(chatController.createChat)
// );

// Create a chat request
router.post(
  "/request",
  isLoggedIn,
  checkSimilarPrakrithiPremium,
  validateChatRequest,
  checkChatRequestDoesNotContainCurrentUser,
  wrapAsync(checkChatUsersExists),
  wrapAsync(checkDuplicatePrivateChatRequest),
  wrapAsync(checkDuplicateGroupChatName),
  wrapAsync(chatController.createChatRequest)
);

// Accept a chat request
router.post(
  "/request/:id/accept",
  isLoggedIn,
  wrapAsync(checkUserInChatRequest),
  wrapAsync(checkNotAlreadyRespondedToChatRequest),
  wrapAsync(chatController.acceptChatRequest)
);

// Reject a chat request
router.post(
  "/request/:id/reject",
  isLoggedIn,
  wrapAsync(checkUserInChatRequest),
  wrapAsync(checkNotAlreadyRespondedToChatRequest),
  wrapAsync(chatController.rejectChatRequest)
);

// Unified route for sent chat requests (all or filtered by type)
router.get(
  "/sent-requests",
  isLoggedIn,
  wrapAsync(chatController.getSentChatRequests)
);

// Unified route for received chat requests (all or filtered by type)
router.get(
  "/received-requests",
  isLoggedIn,
  wrapAsync(chatController.getReceivedChatRequests)
);

// Get all chats for the current user
router.get("/my-chats", isLoggedIn, wrapAsync(chatController.getMyChats));

// Get all chat messages between the current user and a specific receiver
router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(checkChatOwnership),
  wrapAsync(chatController.getChatMessages)
);

export default router;
