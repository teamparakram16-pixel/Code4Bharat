import removeLocalFiles from "../../../utils/cloudinary/uploadUtils/removeLocalDiskFiles.js";
import ExpressError from "../../../utils/expressError.js";

// Utility to determine file type (based on Multer's file object)
const getFileResourceType = (file) => {
  // Use your own logic if needed
  // Common Multer/Cloudinary pattern: file.mimetype starts with "image/", "video/", or is "application/pdf"
  if (file.mimetype.startsWith("image/")) return "image";
  if (file.mimetype.startsWith("video/")) return "video";
  if (file.mimetype === "application/pdf") return "document";
  // Add more document types as needed
  return "other";
};

export const validatePostMediaExclusivity = async (req, res, next) => {
  // Multer puts files in req.files.media (array) if using .array("media", 5) or .fields([{ name: "media", maxCount: 5 }])
  const files = req.files?.media || [];

  if (!files.length) return next(); // No files uploaded, allow

  // Categorize files
  const images = [];
  const videos = [];
  const documents = [];

  for (const file of files) {
    const type = getFileResourceType(file);
    if (type === "image") images.push(file);
    else if (type === "video") videos.push(file);
    else if (type === "document") documents.push(file);
  }

  // Enforce exclusivity
  const typesUsed = [
    images.length > 0,
    videos.length > 0,
    documents.length > 0,
  ].filter(Boolean).length;


  try {
    if (typesUsed > 1) {
      throw new ExpressError(
        400,
        "You can upload either up to 5 images, or 1 video, or 1 document per post (not a mix)."
      );
    }

    // Enforce individual limits
    if (images.length > 5) {
      throw new ExpressError(400, "Maximum 5 images allowed per post.");
    }
    if (videos.length > 1) {
      throw new ExpressError(400, "Only one video allowed per post.");
    }
    if (documents.length > 1) {
      throw new ExpressError(400, "Only one document allowed per post.");
    }

    next();
  } catch (err) {
    // Clean up local temp files from all keys in req.files
    if (req.files) {
      const tempFiles = Object.values(req.files).flatMap((fileArray) =>
        fileArray.map((file) => file.path)
      );
      await removeLocalFiles(tempFiles);
    }
    next(err);
  }
};
