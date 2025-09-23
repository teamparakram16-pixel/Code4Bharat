import cloudinaryUploadFilesWithCleanup from "../../../utils/cloudinary/uploadUtils/cloudinaryUploadFilesWithCleanup.js";
import ExpressError from "../../../utils/expressError.js";

export const handleUserDocumentUpload = async (req, res, next) => {
  try {
    // Accept from req.user or fallback to userProfile (parse if string)
    let userData = req.user;
    if (!userData) {
      let userProfile = req.body.userProfile;
      if (typeof userProfile === "string") {
        try {
          userProfile = JSON.parse(userProfile);
        } catch (e) {
          throw new ExpressError(400, "Invalid userProfile JSON in form data");
        }
      }
      userData = userProfile;
    }

    // Support both root-level and nested profile.fullName
    let fullName = userData.fullName || (userData.profile && userData.profile.fullName) || userData.username;
    let userId = userData._id || (userData.profile && userData.profile._id) || "unknownUser";
    if (!fullName) {
      console.error("userData missing or incomplete:", userData);
      throw new ExpressError(400, "Missing user information (fullName) for document upload");
    }

    const userFolder = fullName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const folder = `arogyaPath_DEV/user_documents/${userFolder}_${userId}`;

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new ExpressError(400, "No documents uploaded. Please attach required files.");
    }

    const uploaded = await cloudinaryUploadFilesWithCleanup(req.files, {
      folder,
      tags: ["user_verification"],
      context: { user_id: userData._id || "unknown" },
    });

    req.documentUrls = Object.fromEntries(
      Object.entries(uploaded).map(([field, info]) => [field, info[0].url])
    );

    next();
  } catch (error) {
    console.error("Document upload error:", error);
    throw new ExpressError(500, "Error uploading user documents: " + (error.message || error));
  }
};
