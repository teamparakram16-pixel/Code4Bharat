import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import routineController from "../controllers/routine.js";
import {
  createCommentForModel,
  getCommentsForModel,
} from "../controllers/commentController.js";
import Routine from "../models/Routines/Routines.js";
import { validateComment } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import { validateRoutine } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import { storage } from "../cloudConfig.js";
import multer from "multer";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import {
  cloudinaryErrorHandler,
  parseFormdata,
} from "../middlewares/cloudinaryMiddleware.js";
import { verifyPostData } from "../middlewares/verifyPostMiddleware.js";
import { handleRoutineImageDiskUpload } from "../middlewares/cloudinary/handleRoutinesImage/handleRoutineImageDiskUpload.js";
import { handleRoutinePostCloudinaryUpload } from "../middlewares/cloudinary/handleRoutinesImage/handleRoutineImageUpload.js";
const memoryUpload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/",
  checkExpertLogin,
  handleRoutineImageDiskUpload,
  parseFormdata,
  validateRoutine,
  wrapAsync(verifyPostData),
  wrapAsync(handleRoutinePostCloudinaryUpload),
  wrapAsync(routineController.createRoutine)
);

router.get("/", isLoggedIn, wrapAsync(routineController.getAllRoutines));

router.get("/filter", isLoggedIn, wrapAsync(routineController.filterRoutines));

router.get("/:id", isLoggedIn, wrapAsync(routineController.getRoutineById));

router.put(
  "/:id",
  checkExpertLogin,
  validateRoutine,
  wrapAsync(routineController.updateRoutine)
);

router.delete(
  "/:id",
  checkExpertLogin,
  wrapAsync(routineController.deleteRoutine)
);

// Nested comment routes for routines
router.get("/:id/comments", wrapAsync(getCommentsForModel("Routine")));
router.post(
  "/:id/comments",
  validateComment,
  wrapAsync(createCommentForModel(Routine, "Routine"))
);

export default router;
