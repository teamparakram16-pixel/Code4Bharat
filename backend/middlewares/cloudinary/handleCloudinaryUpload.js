// middlewares/cloudinaryMiddleware.js
import ExpressError from "../../utils/expressError.js";
import { uploadToCloudinary } from "./cloudinaryUploadUtil.js";

export const handleCloudinaryUpload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next();

    const uploads = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer, file.mimetype))
    );

    req.cloudinaryFiles = uploads;
    next();
  } catch (err) {
    console.error("Cloudinary Upload Failed:", err);
    // Throw an ExpressError to be caught by the global error handler
    throw new ExpressError(500, "Media upload failed due to an internal error");
  }
};
