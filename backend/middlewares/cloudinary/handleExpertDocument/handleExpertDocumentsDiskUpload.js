import multer from "multer";
import ExpressError from "../../../utils/expressError.js";
import { expertDocumentUpload } from "../../../utils/cloudinary/uploadConfigs/expertDocumentUploadConfig.js";

export const handleExpertDocumentDiskUpload = (req, res, next) =>
  expertDocumentUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        throw new ExpressError(400, "File size too large. Maximum size is 5MB");
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        throw new ExpressError(400, "Too many files. Maximum is 4 documents");
      }
      throw new ExpressError(400, err.message);
    } else if (err) {
      throw new ExpressError(400, err.message);
    }
    next();
  });
