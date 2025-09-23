import Expert from "../models/Expert/Expert.js";
import SuccessStory from "../models/SuccessStory/SuccessStory.js";
import User from "../models/User/User.js";
import calculateReadTime from "../utils/calculateReadTime.js";
import generateFilters from "../utils/geminiApiCalls/generateFilters.js";
import { sendEmail } from "../utils/sendEmail.js";
import ExpressError from "../utils/expressError.js";
import populateSuccessStory from "../utils/populateSuccesssStory.js";
import deleteCloudinaryFiles from "../utils/cloudinary/uploadUtils/deleteCloudinaryFiles.js";
// 1. Create a Success Story
export const createSuccessStory = async (req, res) => {
  const { title, description, routines, tagged } = req.body;
  const mediaFiles = req.cloudinaryUrls;
  const readTime = calculateReadTime({ title, description, routines });

  const media = {
    images: [],
    video: null,
    document: null,
  };

  //Cloudinary stores file URLs in `path`
  mediaFiles?.forEach((file) => {
    // Determine file type from Cloudinary response
    if (file.resource_type === "image") {
      media.images.push(file.url);
    } else if (file.resource_type === "video") {
      media.video = file.url;
    } else if (file.format === "pdf" || file.resource_type === "raw") {
      media.document = file.url;
    }
  });

  //Generate categories using ONLY the description
  const filters = await generateFilters(title, description, routines);

  const newSuccessStory = await SuccessStory.create({
    title,
    description,
    media,
    filters,
    tagged,
    routines,
    readTime,
    owner: req.user._id,
  });

  // Update experts if tagged
  if (tagged.length > 0) {
    await Expert.updateMany(
      { _id: { $in: tagged } },
      { $push: { taggedPosts: newSuccessStory._id } }
    );
  }

  // Update current user
  await User.findByIdAndUpdate(req.user._id, {
    $push: { successStories: newSuccessStory._id },
  });

  // Notify each expert via email
  const expertsData = await Expert.find({ _id: { $in: tagged } });

  for (const [index, eachExpert] of expertsData.entries()) {
    const emailSubject = "You've Been Tagged - Please Verify a Success Story";

    const emailContent = `
  <h3>Hello Dr. ${eachExpert.profile?.fullName || eachExpert.username},</h3>
  <p>
    You've been <strong>tagged</strong> in a user's success story on <strong>ArogyaPath</strong>.
  </p>
  <p>
    We value your expertise and kindly request you to <strong>review and verify</strong> the story by visiting the link below:
  </p>
  <p>
    <a href="${process.env.VITE_API_URL}/success-stories/${
      newSuccessStory._id
    }" target="_blank">
      View and Verify the Story
    </a>
  </p>
  <p>
    If you believe this was an error or do not wish to be tagged, you may ignore this email.
  </p>
  <br />
  <p>Thank you,<br/>ArogyaPath Team</p>
`;

    await sendEmail(eachExpert.email, emailSubject, emailContent, null);
  }

  // Success response
  return res.status(200).json({
    message: "Post created",
    success: true,
    postId: newSuccessStory._id,
    userId: req.user._id,
  });
};

// 2. Get All Success Stories
export const getAllSuccessStories = async (req, res) => {
  const query = populateSuccessStory(SuccessStory.find().select("-updatedAt"));
  const stories = await query.exec();

  const userId = req.user._id.toString();

  const transformedSuccessStories = stories.map((story) => {
    const isTagged = story.tagged.some(
      (expert) => expert._id.toString() === userId
    );
    const alreadyVerified = story.verified.some(
      (v) => v.expert && v.expert._id.toString() === userId
    );
    const alreadyRejected = story.rejections.some(
      (rej) => rej.expert && rej.expert._id.toString() === userId
    );
    const verifyAuthorization =
      (req.user.role === "expert" &&
        story.tagged.length === 0 &&
        !alreadyVerified &&
        !alreadyRejected &&
        story.verified.length + story.rejections.length < 5) ||
      (req.user.role === "expert" &&
        isTagged &&
        !alreadyVerified &&
        !alreadyRejected);

    return {
      ...story.toObject(),
      verifyAuthorization,
      alreadyVerified,
      alreadyRejected,
    };
  });

  return res.status(200).json({
    message: "Success stories retrieved successfully",
    success: true,
    successStories: transformedSuccessStories,
    userId: req.user._id,
    userRole: req.user.role,
  });
};

// 3. Get a Single Success Story
export const getSingleSuccessStory = async (req, res) => {
  const { id } = req.params;
  let successStory = await populateSuccessStory(
    SuccessStory.findById(id).select("-updatedAt")
  );
  if (!successStory) {
    throw new ExpressError(404, "Success story not found");
  }
  const userId = req.user._id.toString();
  const isTagged = successStory.tagged.some(
    (expert) => expert._id.toString() === userId
  );
  const alreadyVerified = successStory.verified.some(
    (v) => v.expert && v.expert._id.toString() === userId
  );
  const alreadyRejected = successStory.rejections.some(
    (rej) => rej.expert && rej.expert._id.toString() === userId
  );
  const verifyAuthorization =
    (req.user.role === "expert" &&
      successStory.tagged.length === 0 &&
      successStory.verified.length + successStory.rejections.length < 5 &&
      !alreadyVerified &&
      !alreadyRejected) ||
    (req.user.role === "expert" &&
      isTagged &&
      !alreadyVerified &&
      !alreadyRejected);

  const transformedSuccessStory = {
    ...successStory.toObject(),
    verifyAuthorization,
    alreadyVerified,
    alreadyRejected,
  };

  return res.status(200).json({
    message: "Success story retrieved successfully",
    success: true,
    successStory: transformedSuccessStory,
    userId: req.user._id,
    userRole: req.user.role,
  });
};

export const updateSuccessStory = async (req, res) => {
  const { id } = req.params;
  const { title, description, routines } = req.body;
  console.log("UPDATE INPUT:", { title, description, routines });

  const successStory = await SuccessStory.findById(id);

  if (!successStory) {
    return res.status(404).json({ message: "Success story not found" });
  }

  // 🔐 Authorization check
  if (successStory.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not authorized to update this post" });
  }

  const readTime = calculateReadTime({ title, description, routines });

  successStory.title = title;
  successStory.description = description;
  successStory.routines = routines;
  successStory.readTime = readTime;
  successStory.verified = [];         // Reset verified
  successStory.status = "pending";    // Reset status

  const updatedSuccessStory = await successStory.save();

  return res.status(200).json({
    message: "Success story updated successfully",
    data: updatedSuccessStory,
  });
};


// 5. Delete Success Story

export const deleteSuccessStory = async (req, res) => {
  const { id } = req.params;

  const story = await SuccessStory.findById(id);
  if (!story) {
    throw new ExpressError(404, "Success story not found");
  }

  const filesToDelete = [];

  // Helper to extract public_id from Cloudinary URL
  const extractPublicId = (url, resource_type) => {
    const parts = url.split("/");
    const fileWithExtension = parts.pop(); // filename.ext
    const publicId = fileWithExtension.split(".")[0]; // filename
    const folder = parts.slice(parts.indexOf("upload") + 1).join("/"); // everything after upload/
    return {
      public_id: `${folder}/${publicId}`,
      resource_type,
    };
  };

  // Images (can be multiple)
  if (story.media?.images?.length > 0) {
    for (const url of story.media.images) {
      filesToDelete.push(extractPublicId(url, "image"));
    }
  }

  // Video (only one)
  if (story.media?.video) {
    filesToDelete.push(extractPublicId(story.media.video, "video"));
  }

  // Document (e.g., PDF)
  if (story.media?.document) {
    filesToDelete.push(extractPublicId(story.media.document, "raw"));
  }

  // Delete all media files from Cloudinary
  await deleteCloudinaryFiles(filesToDelete);

  // Remove story from database
  await story.deleteOne();

  return res.status(200).json({
    message: "Success story and media deleted successfully",
    success: true,
  });
};

// 6. Verify or Reject Success Story
export const verifySuccessStory = async (req, res) => {
  const { id } = req.params;
  const expertId = req.user._id;
  const { action, reason } = req.body;

  const successStory = req.successStory;

  if (!successStory) {
    throw new ExpressError(404, "Success story not found");
  }

  // Calculate total verifications and rejections count
  const totalActions =
    (successStory.verified?.length || 0) +
    (successStory.rejections?.length || 0);

  if (action === "accept") {
    if (totalActions >= 5) {
      throw new ExpressError(403, "Verification limit reached");
    }

    // Add to verified array
    successStory.verified.push({
      expert: expertId,
      date: new Date(),
    });

    await successStory.save();

    await Expert.findByIdAndUpdate(
      expertId,
      {
        $addToSet: { verifiedPosts: { post: id, action } },
        $pull: { taggedPosts: id },
      },
      { new: true }
    );
  } else {
    // Add to rejections array
    successStory.rejections.push({
      expert: expertId,
      reason: reason.trim(),
      date: new Date(),
    });

    await successStory.save();

    await Expert.findByIdAndUpdate(
      expertId,
      {
        $addToSet: { verifiedPosts: { post: id, action, reason } },
        $pull: { taggedPosts: id },
      },
      { new: true }
    );
  }

  // Re-fetch the updated story with population
  const populatedStory = await populateSuccessStory(
    SuccessStory.findById(id).select("verified rejections")
  );

  const transformedStory = populatedStory.toObject();

  return res.status(200).json({
    success: true,
    message:
      action === "reject"
        ? "Success story rejected successfully"
        : "Success story verified successfully",
    data: {
      id: populatedStory._id,
      verified: populatedStory.verified,
      rejected: populatedStory.rejections,
      successStory: transformedStory,
    },
  });
};

const filterSuccessStories = async (req, res) => {
  const { filters } = req.query;
  if (!filters) {
    throw new ExpressError(400, "Filters not provided");
  }

  const categoryArray = filters
    .split(",")
    .map((cat) => cat.toLowerCase().trim());

  const successStories = await SuccessStory.find({
    filters: { $in: categoryArray },
  })
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage")
    .populate(
      "tagged",
      "_id profile.fullName profile.profileImage profile.expertType"
    )
    .populate(
      "verified",
      "_id profile.fullName profile.profileImage profile.expertType"
    );

  res.json({ success: true, message: "Filtered posts", successStories });
};

// const rejectedSuccessStory = async (req, res) => {
//   const { id } = req.params;
//   const expertId = req.user._id;
//   const { reason } = req.body;

//   if (!reason || reason.trim().length === 0) {
//     throw new ExpressError("Rejection reason is required", 400);
//   }

//   const post = await SuccessStory.findById(id);
//   if (!post) {
//     throw new ExpressError("Success Story not found", 404);
//   }

//   post.status = "rejected";
//   post.rejections.push({
//     expert: expertId,
//     reason: reason.trim(),
//   });

//   await post.save();

//   res.json({ message: "Success story rejected", post });
// };

//Get Success Stories by User ID
const getSuccessStoriesByUserId = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  const stories = await SuccessStory.find({
    _id: { $in: user.successStories },
  }).select("-updatedAt");

  const populatedStories = await Promise.all(
    stories.map((story) =>
      populateSuccessStory(SuccessStory.findById(story._id)).then((doc) =>
        doc.toObject()
      )
    )
  );

  return res.status(200).json({
    success: true,
    message: "Success stories retrieved by user ID",
    successStories: populatedStories,
    userId,
  });
};

export default {
  createSuccessStory,
  getAllSuccessStories,
  getSingleSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  verifySuccessStory,
  filterSuccessStories,
  // rejectedSuccessStory,
  getSuccessStoriesByUserId,
};
