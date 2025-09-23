import express from "express";
import { isAlreadyLoggedIn } from "../../middlewares/commonAuth.js";
import {
  validateForgotPassword,
  validateResetPassword,
} from "../../middlewares/validationMiddleware/validationMiddlewares.js";
import wrapAsync from "../../utils/wrapAsync.js";
import commonAuthController from "../../controllers/auth/commonAuth.js";

const router = express.Router();

router.get("/logout", commonAuthController.logout);

router.get("/check", commonAuthController.checkAuth);

router.post(
  "/forgot-password",
  isAlreadyLoggedIn,
  validateForgotPassword,
  wrapAsync(commonAuthController.setForgotPasswordToken)
);

router.post(
  "/reset-password",
  isAlreadyLoggedIn,
  validateResetPassword,
  wrapAsync(commonAuthController.resetPassword)
);

export default router;
