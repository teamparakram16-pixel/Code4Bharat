import express from "express";
import emailVerificationController from "../../controllers/auth/emailVerification.js";
import {
  isAlreadyVerified,
  isEmailAlreadyVerified,
} from "../../middlewares/commonAuth.js";
import wrapAsync from "../../utils/wrapAsync.js";

const router = express.Router();

// Route to send verification email
// POST /auth/email/send-verification/:userId?type=User|Expert
router.post(
  "/send-verification",
  wrapAsync(isEmailAlreadyVerified),
  wrapAsync(emailVerificationController.sendVerificationEmail)
);

// Route to verify email with token
// GET /auth/email/verify/:id/:token?type=User|Expert
router.get(
  "/verify/:id/:token",
  wrapAsync(isEmailAlreadyVerified),
  wrapAsync(emailVerificationController.verifyEmail)
);

export default router;
