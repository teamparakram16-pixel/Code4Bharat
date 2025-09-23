import cloudinaryUploadFilesWithCleanup from "../../../utils/cloudinary/uploadUtils/cloudinaryUploadFilesWithCleanup.js";
import ExpressError from "../../../utils/expressError.js";

export const handleRoutineResponseCloudinaryUpload = async (req, res, next) => {
  const appointment_id = req.params.id;
  if (!req.files || !req.files.routineResponse)
    throw new ExpressError(400, "No routine response PDF provided.");

  try {
    const uploaded = await cloudinaryUploadFilesWithCleanup(req.files, {
      folder: `arogyaPath_DEV/routine_response_pdfs`,
      tags: ["routine_response_pdf"],
      context: {
        user_id: req.user._id,
        appointment_id: appointment_id || "new",
      },
    });

    console.log("Uploaded to Cloudinary:", uploaded);

    // Attach PDF URL to request
    req.routineResponsePdfUrl = uploaded.routineResponse[0].url;

    next();
  } catch (error) {
    throw new ExpressError(
      500,
      "Error uploading routine response PDF: " + error.message
    );
  }
};
