import ExpressError from "../../utils/expressError.js";

// Middleware to validate required documents
export const validateExpertDocuments = (req, res, next) => {
  const files = req.files;

  if (!files) {
    throw new ExpressError(400, "No documents uploaded");
  }

  // Check for required documents
  const missingDocuments = [
    "identityProof",
    "degreeCertificate",
    "registrationProof",
    "practiceProof",
  ].filter((docType) => !files[docType]);

  if (missingDocuments.length > 0) {
    throw new ExpressError(
      400,
      `Missing required documents: ${missingDocuments.join(", ")}`
    );
  }

  next();
};
