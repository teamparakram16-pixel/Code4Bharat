import express from "express";
import passport from "passport";
import emailPasswordUserAuthController from "../../controllers/auth/user/userEmailPasswordLogin.js";
import wrapAsync from "../../utils/wrapAsync.js";
import {
  isAlreadyLoggedIn,
  isEmailVerified,
} from "../../middlewares/commonAuth.js";
import {
  validateUserSignup,
  validateLogin,
} from "../../middlewares/validationMiddleware/validationMiddlewares.js";

const router = express.Router();

router.get("/failureLogin", emailPasswordUserAuthController.failureLogin);

router.post(
  "/signUp",
  isAlreadyLoggedIn,
  validateUserSignup,
  wrapAsync(emailPasswordUserAuthController.signUp)
);

router.post(
  "/login",
  isAlreadyLoggedIn,
  validateLogin,
  wrapAsync(isEmailVerified),
  passport.authenticate("user", {
    failureRedirect: "/api/auth/user/failureLogin",
  }),
  emailPasswordUserAuthController.login
);

router.get("/check", isAlreadyLoggedIn, emailPasswordUserAuthController.login);

// Email verification routes
import emailVerificationRoutes from "./emailVerification.js";
router.use("/verify", emailVerificationRoutes);

export default router;
