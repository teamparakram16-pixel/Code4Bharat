import express from "express";
import passport from "passport";
import expertEmailPasswordExpertAuthController from "../../controllers/auth/expert/expertEmailPasswordLogin.js";
import wrapAsync from "../../utils/wrapAsync.js";
import {
  isAlreadyLoggedIn,
  isEmailVerified,
} from "../../middlewares/commonAuth.js";
import {
  validateExpertSignup,
  validateLogin,
} from "../../middlewares/validationMiddleware/validationMiddlewares.js";

const router = express.Router();

router.get("/failureLogin", expertEmailPasswordExpertAuthController.failureLogin);

router.post(
  "/signUp",
  isAlreadyLoggedIn,
  validateExpertSignup,
  wrapAsync(expertEmailPasswordExpertAuthController.signUp)
);

router.post(
  "/login",
  isAlreadyLoggedIn,
  validateLogin,
  wrapAsync(isEmailVerified),
  passport.authenticate("expert", {
    failureRedirect: "/api/auth/expert/failureLogin",
  }),
  expertEmailPasswordExpertAuthController.login
);

router.get("/check", expertEmailPasswordExpertAuthController.login);

router.put(
  "/complete-profile",
  // isAuthenticated,
  // checkCompleteProfileForm,
  wrapAsync(expertEmailPasswordExpertAuthController.completeProfile)
);

export default router;
