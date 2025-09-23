import cloudinaryUploadFilesWithCleanup from "../../../utils/cloudinary/uploadUtils/cloudinaryUploadFilesWithCleanup.js";

export const handleRoutinePostCloudinaryUpload = async (req, res, next) => {
  if (!req.files || !req.files.thumbnail) return next();

  try {
    const uploaded = await cloudinaryUploadFilesWithCleanup(req.files, {
      folder: `arogyaPath_DEV/routines_thumbnail_images`,
      tags: ["routines_thumbnail_images"],
      context: {
        user_id: req.user._id,
        post_id: req.body.postId || "new",
      },
    });

    // Attach URLs to request
    req.thumbnail = uploaded.thumbnail;

    next();
  } catch (error) {
    throw new ExpressError(
      500,
      "Error uploading post images: " + error.message
    );
  }
};
