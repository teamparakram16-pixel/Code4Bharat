import multer from "multer";
import ExpressError from "../../../utils/expressError.js";
import { routinePostImageUpload } from "../../../utils/cloudinary/uploadConfigs/routinesPostUploadConfig.js";

export const handleRoutineImageDiskUpload = (req, res, next) =>
  routinePostImageUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        let errorMessage;
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            errorMessage = "File size too large. Maximum 5MB per file";
            break;
          case "LIMIT_FILE_COUNT":
            errorMessage = "Too many files. Maximum 3 images allowed";
            break;
          case "LIMIT_UNEXPECTED_FILE":
            errorMessage = "Invalid field name. Use 'media' for uploads";
            break;
          default:
            errorMessage = `File upload error: ${err.message}`;
        }
        return next(new ExpressError(400, errorMessage)); // FIX: Use next() instead of throw
      } else {
        return next(new ExpressError(400, err.message)); // FIX: Use next() instead of throw
      }
    }
    next();
  });
