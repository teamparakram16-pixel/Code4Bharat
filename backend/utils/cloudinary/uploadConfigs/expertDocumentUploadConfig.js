// expertDocumentUploadConfig.js

import createMulterUploader from "../multerConfig.js";



const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const REQUIRED_DOCUMENTS = [
  { name: "identityProof", maxCount: 1 },
  { name: "degreeCertificate", maxCount: 1 },
  { name: "registrationProof", maxCount: 1 },
  { name: "practiceProof", maxCount: 1 },
];

export const expertDocumentUpload = createMulterUploader({
  uploadDir: "uploads/temp/expert-documents",
  allowedFileTypes: ALLOWED_FILE_TYPES,
  maxFileSize: MAX_FILE_SIZE,
  fields: REQUIRED_DOCUMENTS,
});
