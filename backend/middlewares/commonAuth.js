import User from "../models/User/User.js";
import Expert from "../models/Expert/Expert.js";
import ExpressError from "../utils/expressError.js";
import findUserById from "../utils/findUserById.js";

export const isAlreadyLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
 
    return next();
  } else {
    throw new ExpressError(400,"Already logged in");
  }
};

export const isLoggedIn = (req, res, next) => {

  if (req.isAuthenticated()) {
    return next();
  } else {
    throw new ExpressError(401,"Authentication required");
  }
};

export const isExpert = (req, res, next) => {
  if (req.user.role == "expert") {
    return next();
  } else {
    throw new ExpressError("Expert authorization required", 403);
  }
};

export const isUser = (req, res, next) => {
  if (req.user.role == "user") {
    return next();
  } else {
    throw new ExpressError("User authorization required", 403);
  }
};

export const isEmailAlreadyVerified = async (req, res, next) => {
  let foundUser = null;

  if (req.params.id && req.query.type) {
    foundUser = await findUserById(req.params.id, req.query.type);
  } else if (req.body.email) {
    // Try to find user/expert with this email
    const user = await User.findOne({ email: req.body.email });
    const expert = await Expert.findOne({ email: req.body.email });
    foundUser = user || expert;
  }

  if (!foundUser) {
    throw new ExpressError(404, "No user exists");
  }


  // Check if already verified
  if (foundUser.verifications?.email) {
    throw new ExpressError(400, "Email already verified");
  }

  req.user = foundUser;

  next();
};

export const isEmailVerified = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    if (!role || (role !== "User" && role !== "Expert")) {
      throw new ExpressError(400, "correct role is required");
    }

    if (!email) {
      throw new ExpressError("Email is required", 400);
    }

    let foundUser = null;


    // Try to find user/expert with this email
    if (role === "User") {
      foundUser = await User.findOne({ email });
    } else {
      foundUser = await Expert.findOne({ email });
    }

    if (!foundUser) {
      return next();
    }

    // Check if email is verified
    if (!foundUser.verifications?.email) {
      throw new ExpressError(403, "Email verification required");
    }

    req.user = foundUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const isAlreadyVerified = (req, res, next) => {
  const { verifications } = req.user;
  const missingVerifications = [];

  // Check email verification for all users
  if (!verifications?.email) {
    missingVerifications.push("email");
  }

  // Check phone verification for all users
  if (!verifications?.contactNo) {
    missingVerifications.push("phone");
  }

  // Additional checks for experts
  if (req.user.role === "expert" && !verifications?.isDoctor) {
    missingVerifications.push("doctor");
  }

  if (missingVerifications.length > 0) {
    throw new ExpressError(
      `Verification required: ${missingVerifications.join(", ")}`,
      403,
      {
        verificationNeeded: missingVerifications[0],
        allMissingVerifications: missingVerifications,
        currentVerifications: verifications,
      }
    );
  }
  return next();
};

export const profileAlreadyCompleted = (req, res, next) => {
  if (req.user.verifications.completeProfile) {
    throw new ExpressError(400, "Profile already completed");
  }

  next();
};

export default {
  isAlreadyLoggedIn,
  isLoggedIn,
  isEmailVerified,
  isAlreadyVerified,
  isExpert,
  isUser,
  profileAlreadyCompleted,
};
