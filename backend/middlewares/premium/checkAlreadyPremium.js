import ExpressError from "../../utils/expressError.js";

const checkAlreadyPremiumUser = (req, res, next) => {
  const user = req.user; // Assumes auth middleware sets req.user

  console.log("Checking if user is already premium:", user);

  if (
    user &&
    user.premiumFeature &&
    user.premiumFeature.validTill &&
    new Date(user.premiumFeature.validTill) > new Date()
  ) {
    throw new ExpressError(
      403,
      "You are already a premium user. No need to buy again."
    );
  }

  next();
};

export default checkAlreadyPremiumUser;
