// utils/uploadToCloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryResourceType } from "../../getCloudinaryResourceType.js";

/**
 * Upload multiple files to Cloudinary.
 * @param {Object} files - Multer files object (fieldName: [file, ...])
 * @param {Object} options
 * @param {string} options.folder - Cloudinary folder path
 * @param {Array|string} [options.tags] - Tags to add to each upload
 * @param {Object} [options.context] - Context metadata
 * @returns {Promise<{ uploaded: Object, uploadedCloudinary: Array, tempFiles: Array }>}
 */
const uploadToCloudinary = async (files, options = {}) => {
  const { folder, tags = [], context = {} } = options;
  const uploaded = {};
  const uploadedCloudinary = [];
  const tempFiles = [];

  for (const [fieldName, fileArray] of Object.entries(files)) {
    uploaded[fieldName] = [];
    for (const file of fileArray) {
      tempFiles.push(file.path);

      const resourceType = getCloudinaryResourceType(file.mimetype);


      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: resourceType,
        tags: Array.isArray(tags) ? tags : [tags],
        context: { ...context, document_type: fieldName },
      });

      uploaded[fieldName].push({
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        original_filename: result.original_filename,
      });

      uploadedCloudinary.push({
        public_id: result.public_id,
        resource_type: result.resource_type,
      });
    }
  }
  return { uploaded, uploadedCloudinary, tempFiles };
};

export default uploadToCloudinary;
