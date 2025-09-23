// utils/deleteCloudinaryFiles.js
import { v2 as cloudinary } from "cloudinary";

/**
 * Deletes an array of Cloudinary files.
 * @param {Array<{ public_id: string, resource_type?: string }>} files
 * @returns {Promise<void>}
 */
const deleteCloudinaryFiles = async (files = []) => {
  for (const { public_id, resource_type } of files) {
    try {
      await cloudinary.uploader.destroy(public_id, {
        resource_type: resource_type || "image",
        invalidate: true,
      });
    } catch (err) {
      console.error(
        `Error deleting Cloudinary file ${public_id}:`,
        err.message
      );
    }
  }
};

export default deleteCloudinaryFiles;
