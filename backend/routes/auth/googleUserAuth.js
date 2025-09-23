import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import googleAuthController from "../../controllers/auth/googleAuth.js";

const router = express.Router();

passport.use(
  "google-user",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "default-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "default-client-secret",
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/user/callback`,
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    googleAuthController.googleCallBackFunctionForUser
  )
);

router.get(
  "/",
  passport.authenticate("google-user"),
  googleAuthController.handleGoogleAuthError
);

router.get(
  "/callback",
  passport.authenticate("google-user", {
    failureRedirect: "/api/auth/google/user/failureLogin",
    failureMessage: true,
  }),
  googleAuthController.handleGoogleCallback
);

router.get("/failureLogin", googleAuthController.handleGoogleAuthFailiure);

export default router;
