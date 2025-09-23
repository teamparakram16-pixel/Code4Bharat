import ExpressError from "../../utils/expressError.js";

// Middleware to validate required documents for user profile
export const validateUserDocuments = (req, res, next) => {
  const files = req.files;

  if (!files) {
    throw new ExpressError(400, "No documents uploaded");
  }

  // Check for required government ID
  if (!files["governmentId"]) {
    throw new ExpressError(400, "Missing required document: governmentId");
  }

  next();
};
