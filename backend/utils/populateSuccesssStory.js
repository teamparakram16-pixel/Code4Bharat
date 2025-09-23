// Utility for population
const populateSuccessStory = (query) =>
  query
    .populate("owner", "_id profile.fullName profile.profileImage")
    .populate(
      "tagged",
      "_id profile.fullName profile.profileImage profile.expertType"
    )
    .populate(
      "verified.expert",
      "_id profile.fullName profile.profileImage profile.expertType"
    )
    .populate(
      "rejections.expert",
      "_id profile.fullName profile.profileImage profile.expertType"
    );

export default populateSuccessStory;
