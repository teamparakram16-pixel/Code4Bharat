export const getCloudinaryResourceType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "raw"; // for PDF, ZIP, DOCX, etc.
};
