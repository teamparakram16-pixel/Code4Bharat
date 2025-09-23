import cloudinaryUploadFilesWithCleanup from "../../../utils/cloudinary/uploadUtils/cloudinaryUploadFilesWithCleanup.js";
import ExpressError from "../../../utils/expressError.js";

export const handleExpertDocumentUpload = async (req, res, next) => {
  try {
    const expertFolder = req.user.profile.fullName.replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );
    const folder = `arogyaPath_DEV/expert_documents/${expertFolder}_${req.user._id}`;

    const uploaded = await cloudinaryUploadFilesWithCleanup(req.files, {
      folder,
      tags: ["expert_verification"],
      context: { user_id: req.user._id },
    });

    req.documentUrls = Object.fromEntries(
      Object.entries(uploaded).map(([field, info]) => [field, info[0].url])
    );
    next();
  } catch (error) {
    throw new ExpressError(500, "Error uploading documents: " + error.message);
  }
};
