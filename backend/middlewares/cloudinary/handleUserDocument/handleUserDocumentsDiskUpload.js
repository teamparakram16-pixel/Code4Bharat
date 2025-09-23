import multer from "multer";
import ExpressError from "../../../utils/expressError.js";
import { userDocumentUpload } from "../../../utils/cloudinary/uploadConfigs/userDocumentUploadConfig.js";

export const handleUserDocumentDiskUpload = (req, res, next) =>
  userDocumentUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        throw new ExpressError(400, "File size too large. Maximum size is 2MB");
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        throw new ExpressError(400, "Too many files. Maximum is 2 files");
      }
      throw new ExpressError(400, err.message);
    } else if (err) {
      throw new ExpressError(400, err.message);
    }
    next();
  });
