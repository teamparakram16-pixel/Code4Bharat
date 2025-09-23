import createMulterUploader from "../multerConfig.js";

const ALLOWED_FILE_TYPES = ["application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ROUTINE_RESPONSE_FIELDS = [
  { name: "routineResponse", maxCount: 1 }, // Only one PDF allowed
];

export const routineResponseFileUpload = createMulterUploader({
  uploadDir: "uploads/temp/routine-response",
  allowedFileTypes: ALLOWED_FILE_TYPES,
  maxFileSize: MAX_FILE_SIZE,
  fields: ROUTINE_RESPONSE_FIELDS,
});
