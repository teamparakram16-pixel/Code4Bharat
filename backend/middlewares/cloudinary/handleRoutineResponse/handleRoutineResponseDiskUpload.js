import multer from "multer";
import ExpressError from "../../../utils/expressError.js";
import { routineResponseFileUpload } from "../../../utils/cloudinary/uploadConfigs/routineResponseFileUploadConfig.js";

export const handleRoutineResponseDiskUpload = (req, res, next) =>
  routineResponseFileUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        let errorMessage;
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            errorMessage = "File size too large. Maximum 5MB allowed.";
            break;
          case "LIMIT_FILE_COUNT":
            errorMessage = "Only one PDF file allowed for routine response.";
            break;
          case "LIMIT_UNEXPECTED_FILE":
            errorMessage =
              "Invalid field name. Use 'routineResponse' for upload.";
            break;
          default:
            errorMessage = `File upload error: ${err.message}`;
        }
        return next(new ExpressError(400, errorMessage));
      } else {
        // Custom error from fileFilter or other
        return next(new ExpressError(400, err.message));
      }
    }
    next();
  });
