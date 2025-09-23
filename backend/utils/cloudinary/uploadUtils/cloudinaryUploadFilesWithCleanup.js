import deleteCloudinaryFiles from "./deleteCloudinaryFiles.js";
import removeLocalFiles from "./removeLocalDiskFiles.js";
import uploadToCloudinary from "./uploadToCloudinary.js";

/**
 * Uploads files to Cloudinary and ensures cleanup on error.
 */
const cloudinaryUploadFilesWithCleanup = async (files, options = {}) => {
  let uploaded, uploadedCloudinary, tempFiles;
  try {
    // Use the new utility
    ({ uploaded, uploadedCloudinary, tempFiles } = await uploadToCloudinary(
      files,
      options
    ));
    return uploaded;
  } catch (error) {
    // Cleanup Cloudinary uploads if error occurs
    console.log(error);
    await deleteCloudinaryFiles(uploadedCloudinary);
    throw error;
  } finally {
    // Always clean up local temp files
    await removeLocalFiles(tempFiles);
  }
};

export default cloudinaryUploadFilesWithCleanup;
