import Expert from "../../../models/Expert/Expert.js";
import Token from "../../../models/Token/Token.js";
import User from "../../../models/User/User.js";
import ExpressError from "../../../utils/expressError.js";
import crypto from "crypto";
import { sendEmailVerificationLink } from "../../../utils/sendEmailVerificationLink.js";

export const signUp = async (req, res) => {
  let signUpError = false;
  let error = "";
  const { fullName, email, password, expertType } = req.body;

  const user = await User.findOne({ email: email });

  if (user) {
    throw new ExpressError(
      400,
      "User with this email is registered as another role"
    );
  }

  const newExpert = new Expert({
    username: fullName,
    email,
    profile: {
      fullName: fullName,
      expertType: expertType,
    },
  });

  const registeredExpert = await Expert.register(newExpert, password).catch(
    (err) => {
      console.log("signUpError");
      console.log(err);
      signUpError = true;
      if (
        err.message === "A user with the given username is already registered"
      ) {
        error = "A user with the given email is already registered";
      } else {
        error = err.message;
      }
    }
  );

  if (!signUpError && registeredExpert) {
    // Create verification token
    const token = await new Token({
      userType: "Expert",
      userId: registeredExpert._id,
      token: crypto.randomBytes(32).toString("hex"),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }).save();

    let emailError = null;
    try {
      await sendEmailVerificationLink(
        email,
        registeredExpert._id,
        "Expert",
        token.token,
        fullName
      );
    } catch (err) {
      console.error("Failed to send verification email:", err.message);
      emailError = err.message;
      // Optionally store this info in a DB/logs/queue
    }

    return res.status(200).json({
      success: true,
      message: emailError
        ? "Sign-up successful, but failed to send verification email."
        : "Sign-up successful. Verification email sent.",
      verificationEmailSent: emailError === null ? true : false,
      verified: false,
      userId: registeredExpert._id,
    });
  } else {
    throw new ExpressError(400, error);
  }
};

export const login = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "successLogin",
  });
};

export const failureLogin = async (req, res) => {
  console.log("failure");
  res.status(401).json({
    success: false,
    message: "failureLogin",
  });
};

export default {
  signUp,
  login,
  failureLogin,
};
