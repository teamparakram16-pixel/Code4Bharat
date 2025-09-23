import ExpressError from "../../utils/expressError.js";
import getActivePremiumFeature from "../../utils/getActivePremiumFeature.js";


export const checkSimilarPrakrithiPremium = (req, res, next) => {
  const user = req.user;

  // Ensure user is authenticated and premium
  const activePremium = getActivePremiumFeature(user);
  const premiumNo = activePremium ? activePremium.premiumNo : null;

  // Allow only if premiumNo is 2 or 3
  if (!premiumNo || ![2, 3].includes(Number(premiumNo))) {
    throw new ExpressError(
      403,
      "Access to 'similar users' is allowed only for premium members with standard or pro plans"
    );
  }

  return next();
};
