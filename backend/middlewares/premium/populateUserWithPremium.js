import User from "../../models/User/User.js";

export const populateUserWithPremium = async (req, res, next) => {
  // Populate premiumFeatures.premiumOption when loading the user
  const user = await User.findById(req.user._id)
    .populate("premiumFeature.premiumOption")
    .exec();

  req.user = user; // Replace req.user with populated version
  next();
};
