const getActivePremiumFeature = (user) => {
  if (!user?.premiumFeature) return null;

  const now = new Date();
  if (
    user.premiumFeature.validTill &&
    new Date(user.premiumFeature.validTill) > now
  ) {
    return user.premiumFeature;
  }
  return null;
};

export default getActivePremiumFeature;
