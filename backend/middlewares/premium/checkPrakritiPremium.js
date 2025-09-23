import PrakritiUsage from "../../models/PrakrithiUsage/PrakrithiUsage.js";
import getActivePremiumFeature from "../../utils/getActivePremiumFeature.js";
import ExpressError from "../../utils/expressError.js";

// Main middleware
export const checkPrakritiPremium = async (req, res, next) => {
  const user = req.user;

  const now = new Date();
  const activePremium = getActivePremiumFeature(user);
  const premiumNo = activePremium ? activePremium.premiumNo : null;

  // Support PremiumOption durationDays
  const durationDays = activePremium?.premiumOption?.durationDays ?? 30;
  const premiumStartDate =
    activePremium && activePremium.validTill
      ? new Date(
          activePremium.validTill.getTime() - durationDays * 24 * 60 * 60 * 1000
        )
      : null;

  if (!premiumNo) {
    // Free: only 1 usage ever
    const usageCount = await PrakritiUsage.countDocuments({ user: user._id });
    if (usageCount >= 1) {
      throw new ExpressError(
          403,
        "Free tier allows only one Prakriti analysis. Please upgrade for more.",
      
      );
    }
    return next();
  }

  // Limits for premium types
  const PREMIUM_LIMITS = {
    1: { maxInPeriod: 20, maxPerDay: 2 },
    2: { maxInPeriod: 30, maxPerDay: 4 },
    3: { maxInPeriod: 30, maxPerDay: 30 },
  };
  if (!(premiumNo in PREMIUM_LIMITS)) {
    throw new ExpressError(
      "Your subscription does not allow Prakriti Analysis.",
      403
    );
  }
  const limits = PREMIUM_LIMITS[premiumNo];

  // 1. Prakriti analysis limit in last durationDays (from premium start)
  const periodStart =
    premiumStartDate ||
    new Date(now.getTime() - durationDays * 24 * 60 * 60 * 1000);
  const countInPeriod = await PrakritiUsage.countDocuments({
    user: user._id,
    createdAt: { $gte: periodStart, $lte: now },
  });
  if (countInPeriod >= limits.maxInPeriod) {
    throw new ExpressError(
      `Your Prakriti analysis limit of ${limits.maxInPeriod} for your current period is reached.`,
      403
    );
  }

  // 2. Daily analysis limit
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const countToday = await PrakritiUsage.countDocuments({
    user: user._id,
    createdAt: { $gte: todayStart, $lt: tomorrowStart },
  });
  if (countToday >= limits.maxPerDay) {
    throw new ExpressError(
      `You've reached your daily usage limit of ${limits.maxPerDay}. Please try again tomorrow or upgrade.`,
      403
    );
  }

  return next();
};
