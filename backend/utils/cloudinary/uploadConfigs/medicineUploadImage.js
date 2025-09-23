
import createMulterUploader from "../multerConfig.js";

const medicineUploader = createMulterUploader({
  uploadDir: "uploads/medicines",   // local temp folder
  allowedFileTypes: [
    "image/jpeg",
    "image/png",
    "image/jpg",
  ],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  fields: [{ name: "images", maxCount: 5 }], // up to 5 images
});

export default medicineUploader;
