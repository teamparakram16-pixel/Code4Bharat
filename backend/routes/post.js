import express from "express";
import {
  validatePost,
  validateComment,
} from "../middlewares/validationMiddleware/validationMiddlewares.js";
import wrapAsync from "../utils/wrapAsync.js";
import postController from "../controllers/post.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import { parseFormdata } from "../middlewares/cloudinaryMiddleware.js";
import { verifyPostData } from "../middlewares/verifyPostMiddleware.js";
import { handlePostImageDiskUpload } from "../middlewares/cloudinary/handlePostImage/handlePostImageDiskUpload.js";
import { validatePostMediaExclusivity } from "../middlewares/cloudinary/handlePostImage/validatePostMediaExclusivity.js";
import { handlePostCloudinaryUpload } from "../middlewares/cloudinary/handlePostImage/handlePostImageUpload.js";
import {
  createCommentForModel,
  getCommentsForModel,
} from "../controllers/commentController.js";
import Post from "../models/Post/Post.js";

const router = express.Router();

router.get("/", isLoggedIn, wrapAsync(postController.getAllPosts));

router.post(
  "/",
  checkExpertLogin,
  handlePostImageDiskUpload,
  parseFormdata,
  validatePostMediaExclusivity,
  validatePost,
  wrapAsync(verifyPostData),
  wrapAsync(handlePostCloudinaryUpload),
  wrapAsync(postController.createPost)
);

router.get("/filter", isLoggedIn, wrapAsync(postController.filterPosts));

// Nested comment routes for posts
router.get(
  "/:postId/comments",
  isLoggedIn,
  wrapAsync(getCommentsForModel("Post"))
);
router.post(
  "/:postId/comments",
  isLoggedIn,
  validateComment,
  wrapAsync(createCommentForModel(Post, "Post"))
);

router.get("/:postId", isLoggedIn, wrapAsync(postController.getPostById));

router.delete(
  "/:postId",
  checkExpertLogin,
  wrapAsync(postController.deletePost)
);

router.put(
  "/:postId",
  checkExpertLogin,
  validatePost,
  wrapAsync(postController.updatePost)
);

router.post(
  "/verify/:id",
  checkExpertLogin,
  wrapAsync(postController.verifyPost)
);

export default router;
