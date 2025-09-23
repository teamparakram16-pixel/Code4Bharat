import express from "express";
import successStoryControllers from "../controllers/successStory.js";
import {
  createCommentForModel,
  getCommentsForModel,
} from "../controllers/commentController.js";
import SuccessStory from "../models/SuccessStory/SuccessStory.js";
import { validateComment } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import wrapAsync from "../utils/wrapAsync.js";
import { checkUserLogin } from "../middlewares/users/auth.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import { validateSuccessStory } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import { parseFormdata } from "../middlewares/cloudinaryMiddleware.js";
import { checkIsTaggedAndVerified } from "../middlewares/experts/postTagged.js";
import { verifyPostData } from "../middlewares/verifyPostMiddleware.js";
import { handlePostImageDiskUpload } from "../middlewares/cloudinary/handlePostImage/handlePostImageDiskUpload.js";
import { validatePostMediaExclusivity } from "../middlewares/cloudinary/handlePostImage/validatePostMediaExclusivity.js";
import { handlePostCloudinaryUpload } from "../middlewares/cloudinary/handlePostImage/handlePostImageUpload.js";

const router = express.Router();

router.post(
  "/",
  checkUserLogin,
  handlePostImageDiskUpload,
  parseFormdata,
  validatePostMediaExclusivity,
  validateSuccessStory,
  wrapAsync(verifyPostData),
  wrapAsync(handlePostCloudinaryUpload),
  wrapAsync(successStoryControllers.createSuccessStory)
);

router.get(
  "/allposts",
  checkUserLogin,
  wrapAsync(successStoryControllers.getSuccessStoriesByUserId)
);

router.get(
  "/",
  isLoggedIn,
  wrapAsync(successStoryControllers.getAllSuccessStories)
);

router.get(
  "/filter",
  isLoggedIn,
  wrapAsync(successStoryControllers.filterSuccessStories)
);

router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(successStoryControllers.getSingleSuccessStory)
);

router.put(
  "/:id",
  checkUserLogin,
  validateSuccessStory,
  wrapAsync(successStoryControllers.updateSuccessStory)
);

router.delete(
  "/:id",
  checkUserLogin,
  wrapAsync(successStoryControllers.deleteSuccessStory)
);

router.put(
  "/:id/verify",
  checkExpertLogin,
  wrapAsync(checkIsTaggedAndVerified),
  wrapAsync(successStoryControllers.verifySuccessStory)
);

// Nested comment routes for success stories
router.get(
  "/:postId/comments",
  isLoggedIn,
  wrapAsync(getCommentsForModel("SuccessStory"))
);
router.post(
  "/:postId/comments",
  isLoggedIn,
  validateComment,
  wrapAsync(createCommentForModel(SuccessStory, "SuccessStory"))
);

// router.post(
//   "/:id/reject",
//   checkExpertLogin,
//   wrapAsync(checkIsTaggedAndVerified),
//   wrapAsync(successStoryControllers.verifySuccessStory)
// );

export default router;
