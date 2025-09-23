import Expert from "../../models/Expert/Expert.js";
import expressError from "../../utils/expressError.js";
import User from "../../models/User/User.js";

export const handleGoogleAuthError = (err, req, res, next) => {
  if (err) {
    console.error(`Error during Google authentication: ${err.message}`);
    res.redirect(`${process.env.VITE_API_URL}/auth?error=googleAuthError`);
  }
};

export const handleGoogleCallback = (req, res) => {
  const user = req.user;

  // Defensive: Handle missing user object
  if (!user) {
    return res.redirect(`${process.env.VITE_API_URL}/auth?error=missingUser`);
  }

  const { role, verifications } = user;
  const emailVerified = verifications?.email;
  const completeProfile = verifications?.completeProfile;

  // If email is not verified, log out and redirect to email verification
  if (!emailVerified) {
    // Use optional chaining and ensure redirect after logout/session destroy
    if (typeof req.logOut === "function") {
      req.logOut((err) => {
        if (err && typeof req.session?.destroy === "function") {
          req.session.destroy(() => {
            res.redirect(`${process.env.VITE_API_URL}/email/verify`);
          });
        } else {
          res.redirect(`${process.env.VITE_API_URL}/email/verify`);
        }
      });
    } else {
      res.redirect(`${process.env.VITE_API_URL}/email/verify`);
    }
    return;
  }

  // Redirect based on role and profile completion
  if (!completeProfile) {
    if (role === "expert") {
      return res.redirect(
        `${process.env.VITE_API_URL}/complete-profile/expert`
      );
    }
    if (role === "user") {
     // return res.redirect(`${process.env.VITE_API_URL}/complete-profile/user`);
          return res.redirect(`${process.env.VITE_API_URL}/gposts`);
    }
  }

  // Default redirect
  return res.redirect(`${process.env.VITE_API_URL}/gposts`);
};

export const handleGoogleAuthFailiure = (req, res) => {
  // Passport stores the last failure message in req.session.messages
  const message =
    req.session && req.session.messages && req.session.messages.length
      ? req.session.messages[req.session.messages.length - 1]
      : "googleAuthFailure";

  // Clear the message from session after reading (optional)
  if (req.session && req.session.messages) req.session.messages = [];

  // Redirect to frontend with error message as query param
  res.redirect(
    `${process.env.VITE_API_URL}/auth?error=${encodeURIComponent(message)}`
  );
};

export const googleCallBackFunctionForExpert = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const email = profile.emails?.[0]?.value || null;
    const emailVerified =
      profile.emails?.[0]?.verified || profile.email_verified || false;
    if (!email) {
      return done(null, false, {
        message: "Google profile does not have an email",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return done(null, false, {
        message: "Email already exists in User collection",
      });
    }
    const expert = await Expert.findOne({
      $or: [{ googleId: profile.id }, { email: email }],
    });
    if (expert) {
      if (expert.googleId === null) {
        expert.googleId = profile.id;
        await expert.save();
      }
      if (expert.verifications.email) return done(null, expert);

      if (emailVerified) {
        expert.verifications.email = true;
        await expert.save();
      }

      return done(null, expert);
    }
    const newExpert = await Expert.create({
      username: profile.displayName,
      email,
      googleId: profile.id,
      profile: {
        profileImage: profile.picture,
        fullName: profile.displayName,
        expertType: null,
      },
      verifications: {
        email: emailVerified,
      },
    });
    return done(null, newExpert);
  } catch (err) {
    console.error(err);
    return done(null, false, { message: "GoogleAuthError" });
  }
};

export const googleCallBackFunctionForUser = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const email = profile.emails?.[0]?.value || null;
    const emailVerified =
      profile.emails?.[0]?.verified || profile.email_verified || false;

    if (!email) {
      return done(null, false, {
        message: "Google profile does not have an email",
      });
    }

    const expert = await Expert.findOne({ email });
    if (expert) {
      return done(null, false, {
        message: "Email already exists in Expert collection",
      });
    }

    const user = await User.findOne({
      $or: [{ googleId: profile.id }, { email: email }],
    });
    if (user) {
      if (user.googleId === null) {
        user.googleId = profile.id;
        await user.save();
      }
      // If already verified, just return
      if (user.verifications?.email) return done(null, user);

      // If not verified but Google says verified, update and save
      if (emailVerified) {
        user.verifications.email = true;
        await user.save();
      }
      return done(null, user);
    }


    // Create new user with verification status
    const newUser = await User.create({
      username: profile.displayName,
      email,
      googleId: profile.id,
      profile: {
        profileImage: profile.picture,
        fullName: profile.displayName,
      },
      verifications: {
        email: emailVerified,
      },
    });
    return done(null, newUser);
  } catch (err) {
    console.error(err);
    return done(null, false, { message: "GoogleAuthError" });
  }
};

export default {
  handleGoogleAuthError,
  handleGoogleCallback,
  handleGoogleAuthFailiure,
  googleCallBackFunctionForExpert,
  googleCallBackFunctionForUser,
};
