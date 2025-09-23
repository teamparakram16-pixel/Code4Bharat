const isPremiumUser = (req, res, next) => {
  if (
    req.isAuthenticated() &&
    req.user.role === "user" &&
    req.user.premiumUser
  ) {
    return next();
  } else {
    return res.status(403).json({
      success: false,
      message: "You do not have premium access",
    });
  }
};
