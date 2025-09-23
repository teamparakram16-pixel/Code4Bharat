// middleware/handlePostCloudinaryUpload.js
import cloudinaryUploadFilesWithCleanup from "../../../utils/cloudinary/uploadUtils/cloudinaryUploadFilesWithCleanup.js";
import ExpressError from "../../../utils/expressError.js";

export const handlePostCloudinaryUpload = async (req, res, next) => {
  if (!req.files || !req.files.media) return next();

  try {
    const uploaded = await cloudinaryUploadFilesWithCleanup(req.files, {
      folder: `arogyaPath_DEV/post_successStories_images`,
      tags: ["post_successStories_images"],
      context: {
        user_id: req.user._id,
        post_id: req.body.postId || "new",
      },
    });


    // Attach URLs to request
    req.cloudinaryUrls = uploaded.media;

    next();
  } catch (error) {
    throw new ExpressError(
      500,
      "Error uploading post images: " + error.message
    );
  }
};
