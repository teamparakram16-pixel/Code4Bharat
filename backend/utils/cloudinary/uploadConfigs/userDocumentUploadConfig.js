// userDocumentUploadConfig.js

import createMulterUploader from "../multerConfig.js";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const USER_DOCUMENT_FIELDS = [
  { name: "governmentId", maxCount: 1 },      // Required
  { name: "profilePicture", maxCount: 1 },    // Optional
];

export const userDocumentUpload = createMulterUploader({
  uploadDir: "uploads/temp/user-documents",
  allowedFileTypes: ALLOWED_FILE_TYPES,
  maxFileSize: MAX_FILE_SIZE,
  fields: USER_DOCUMENT_FIELDS,
});
