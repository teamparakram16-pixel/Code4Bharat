import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Utility to create a dynamic multer config.
 * @param {Object} options
 * @param {string} options.uploadDir - Directory to save uploads (relative to project root)
 * @param {Array<string>} options.allowedFileTypes - Array of allowed mimetypes
 * @param {number} options.maxFileSize - Maximum file size in bytes
 * @param {Array<{ name: string, maxCount: number }>} options.fields - Multer fields config
 * @returns {multer.Instance}
 */
const createMulterUploader = ({
  uploadDir = "uploads/temp",
  allowedFileTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  fields = [],
}) => {
  // Configure disk storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const absoluteDir = path.join(process.cwd(), uploadDir);

      // Create directory if it doesn't exist
      if (!fs.existsSync(absoluteDir)) {
        fs.mkdirSync(absoluteDir, { recursive: true });
      }

      cb(null, absoluteDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });

  // Extract valid field names for validation
  const validFieldNames = fields.map((f) => f.name);

  // Multer config
  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (!allowedFileTypes.includes(file.mimetype)) {
        return cb(
          new Error(
            `Invalid file type. Allowed types: ${allowedFileTypes.join(", ")}`
          )
        );
      }
      if (!validFieldNames.includes(file.fieldname)) {
        return cb(
          new Error(
            `Invalid field name. Must be one of: ${validFieldNames.join(", ")}`
          )
        );
      }
      cb(null, true);
    },
    limits: {
      fileSize: maxFileSize,
      // files: fields.length,
    },
  }).fields(fields);
};

export default createMulterUploader;
