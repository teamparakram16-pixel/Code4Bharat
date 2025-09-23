import Expert from "../../models/Expert/Expert.js";
import User from "../../models/User/User.js";
import ExpressError from "../../utils/expressError.js";
import { sendEmail } from "../../utils/sendEmail.js";

// Send OTP for contact verification
export const sendOtpForContactVerification = async (req, res, next) => {
  const user = req.user;

  if (user.verifications?.contactNo) {
    throw new ExpressError(400, "Contact number already verified");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP and expiry timestamp inside user model
  user.otpForContact = {
    code: otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires in 5 mins
    verified: false,
  };

  await user.save();

  // Send OTP via email (or SMS service)
  await sendEmail(
    user.email,
    "Your OTP for Contact Verification",
    `<p>Your OTP is: <b>${otp}</b></p>`
  );

  res.status(200).json({
    success: true,
    message: "OTP sent to your email for contact verification",
    contactNo: user.profile.contactNo,
    email: user.email,
  });
};

// Verify OTP and mark phone number verified
export const verifyPhoneNumber = async (req, res, next) => {
  const user = req.user;
  const { otp } = req.body;

  if (!otp) {
    throw new ExpressError(400, "OTP is required");
  }

  if (user.verifications?.contactNo) {
    throw new ExpressError(400, "Contact number already verified");
  }

  if (
    !user.otpForContact ||
    !user.otpForContact.code ||
    !user.otpForContact.expiresAt
  ) {
    throw new ExpressError(
      400,
      "No OTP request found. Please request an OTP first."
    );
  }

  if (new Date() > new Date(user.otpForContact.expiresAt)) {
    throw new ExpressError(400, "OTP has expired. Please request a new OTP.");
  }

  if (otp !== user.otpForContact.code) {
    throw new ExpressError(400, "Invalid OTP");
  }

  // OTP matches, mark contact as verified and clear otpForContact
  user.verifications.contactNo = true;
  user.otpForContact = {
    code: null,
    expiresAt: null, // expires in 5 mins
    verified: false,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Contact number verified successfully",
  });
};
