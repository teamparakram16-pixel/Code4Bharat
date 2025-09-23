import ExpressError from "../utils/expressError.js";

export const parseFormdata = (req, res, next) => {
  // Fields expected to be JSON arrays
  const arrayFields = ["filters", "routines", "tagged"];

  // Fields expected to be JSON objects
  const objectFields = [
    "profile",
    "verificationDetails",
    "userProfile", // ✅ user complete profile
  ];

  try {
    // Parse array fields
    for (const field of arrayFields) {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          throw new ExpressError(`${field} must be a valid JSON array`, 400);
        }
      }
    }

    // Parse object fields
    for (const field of objectFields) {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          throw new ExpressError(`${field} must be a valid JSON object`, 400);
        }
      }
    }

  
    next();
  } catch (err) {
    next(err);
  }
};

// Custom error middleware for Cloudinary-related errors
export const cloudinaryErrorHandler = (err, req, res, next) => {
  if (err.name === "CloudinaryError" || err.message?.includes("Cloudinary")) {
    console.error("Cloudinary Error:", err);

    return res.status(500).json({
      success: false,
      message: "Cloudinary Error: Something went wrong with media upload.",
      details: err.message,
    });
  }

  // Pass to next error handler if not a Cloudinary error
  next(err);
};

export default { parseFormdata, cloudinaryErrorHandler };
