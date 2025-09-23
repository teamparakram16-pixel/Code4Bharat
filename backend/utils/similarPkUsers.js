// Utility to calculate similarity between users' Prakrithi data
const calculateSimilarPrakrithiUsers = (
  currentUserEntry,
  otherUsers,
  fieldsToCompare
) => {
  return otherUsers
    .map((user) => {
      let matches = 0;
      fieldsToCompare.forEach((field) => {
        if (currentUserEntry[field] === user[field]) {
          matches++;
        }
      });
      const similarityPercentage = (
        (matches / fieldsToCompare.length) *
        100
      ).toFixed(2);
      return {
        user: user.user,
        similarityPercentage: Number(similarityPercentage),
      };
    })
    .sort((a, b) => b.similarityPercentage - a.similarityPercentage);
};

export default calculateSimilarPrakrithiUsers;
