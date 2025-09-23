import ExpressError from "../utils/expressError.js";

// Middleware to check and attach user's PrakrithiAnalysis ID
export const checkPrakrithiAnalysisExists = (req, res, next) => {
  // Assumes req.user.prakrithiAnalysis.analysisRef is set
  const prakrithiAnalysisId = req.user?.prakritiAnalysis?.analysisRef;
  if (!prakrithiAnalysisId) {
    throw new ExpressError(400, "User does not have a Prakrithi Analysis.");
  }
  req.prakrithiAnalysisId = prakrithiAnalysisId;
  next();
};
