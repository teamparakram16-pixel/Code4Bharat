import createMulterUploader from "../multerConfig.js";

export const routinePostImageUpload = createMulterUploader({
  uploadDir: "uploads/temp/post-images",
  allowedFileTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  maxFileSize: 5 * 1024 * 1024, //5MB
  fields: [{ name: "thumbnail", maxCount: 1 }],
});
