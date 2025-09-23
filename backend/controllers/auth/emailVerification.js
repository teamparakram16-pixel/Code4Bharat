import Token from "../../models/Token/Token.js";
import { sendEmailVerificationLink } from "../../utils/sendEmailVerificationLink.js";
import crypto from "crypto";
import ExpressError from "../../utils/expressError.js";
import wrapAsync from "../../utils/wrapAsync.js";
import findUserById from "../../utils/findUserById.js";
import User from "../../models/User/User.js";
import Expert from "../../models/Expert/Expert.js";

// Send verification email
export const sendVerificationEmail = async (req, res) => {
  const user = req.user; // from middleware

  const userId = user._id;

  const userType = user.role === "expert" ? "Expert" : "User";

  // Create or update verification token
  let token = await Token.findOne({
    userId: userId,
    userType: userType,
  });

  if (!token) {
    token = await new Token({
      userType: userType,
      userId: userId,
      token: crypto.randomBytes(32).toString("hex"),
      expires: new Date(Date.now() + 3600 * 1000), // 1 hour
    }).save();
  }

  if (token && token.expires < Date.now()) {
    await Token.deleteOne({ userType: userType, userId: userId });
    token = await new Token({
      userType: userType,
      userId: userId,
      token: crypto.randomBytes(32).toString("hex"),
      expires: new Date(Date.now() + 3600 * 1000), // 1 hour
    }).save();
  }

  // Send verification email
  await sendEmailVerificationLink(
    user.email,
    user._id,
    userType,
    token.token,
    user.profile.fullName
  );

  res.status(200).json({
    success: true,
    message: "Verification link sent to email",
  });
};

// Verify email with token
export const verifyEmail = async (req, res) => {
  const { id, token: tokenString } = req.params;
  const userType = req.query.type;

  if (userType !== "Expert" && userType !== "User") {
    throw new ExpressError(400, "Invalid user type"); // 400 = Bad Request
  }

  // Find user/expert
  const user = await findUserById(id, userType);

  if (!user) throw new ExpressError(404, `${userType} not found`);

  // Find and validate token
  const token = await Token.findOne({
    userId: user._id,
    token: tokenString,
    userType: userType,
  });

  if (!token) {
    throw new ExpressError(400, "Invalid or expired verification link");
  }

  // Check if token is expired
  if (token.expires < Date.now()) {
    await token.deleteOne();
    throw new ExpressError(400, "Verification link has expired");
  }

  // Update user verification status
  const Model = userType === "Expert" ? Expert : User;
  await Model.findByIdAndUpdate(user._id, {
    "verifications.email": true,
  });

  // Remove used token
  await token.deleteOne();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
};

export default {
  sendVerificationEmail,
  verifyEmail,
};
