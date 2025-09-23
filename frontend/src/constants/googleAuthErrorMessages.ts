const googleAuthErrorMessages: Record<string, string> = {
  "Google profile does not have an email":
    "Google account does not have an email address.",
  "Email already exists in User collection":
    "This email is already registered as a user.",
  "Email already exists in Expert collection":
    "This email is already registered as an expert.",
  GoogleAuthError: "Google authentication failed. Please try again.",
  googleAuthFailure: "Google authentication failed. Please try again.",
  googleAuthError: "An unexpected error occurred during Google authentication.",
  missingUser: "Something went wrong. Please try logging in again.",
};

export default googleAuthErrorMessages;
