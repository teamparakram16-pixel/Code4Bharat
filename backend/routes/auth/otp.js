import express from "express";
import { isLoggedIn } from "../../middlewares/commonAuth.js";
import {
  sendOtpForContactVerification,
  verifyPhoneNumber,
} from "../../controllers/auth/otpController.js";
import wrapAsync from "../../utils/wrapAsync.js";

const router = express.Router();

router.post(
  "/send-otp-contact",
  isLoggedIn,
  wrapAsync(sendOtpForContactVerification)
);

router.post("/verify-otp-contact", isLoggedIn, wrapAsync(verifyPhoneNumber));

export default router;
