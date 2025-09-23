import Post from "../models/Post/Post.js";
import Expert from "../models/Expert/Expert.js";
import calculateReadTime from "../utils/calculateReadTime.js";
import generateFilters from "../utils/geminiApiCalls/generateFilters.js";
import ExpressError from "../utils/expressError.js";
import deleteCloudinaryFiles from "../utils/cloudinary/uploadUtils/deleteCloudinaryFiles.js";

// Handler functions
const getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage");

  res.status(200).json({
    message: "All posts retrieved",
    success: true,
    posts: posts,
    userId: req.user._id,
  });
};

const getPostById = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId)
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage");

  if (!post) {
    throw new ExpressError(404, "Post not found");
  }

  res.status(200).json({
    message: "Post retrieved",
    success: true,
    post: post,
    userId: req.user._id,
  });
};

const createPost = async (req, res) => {
  const { title, description } = req.body;

  const mediaFiles = req.cloudinaryUrls;


  const media = {
    images: [],
    video: null,
    document: null,
  };

  // Cloudinary stores file URLs in `secure_url`
  mediaFiles?.forEach((file) => {
    const resourceType = file.resource_type.toLowerCase();

    if (file.format === "pdf" || file.resource_type === "raw") {
      media.document = file.url;
    } else if (resourceType === "video") {
      media.video = file.url;
    } else if (resourceType === "image") {
      media.images.push(file.url);
    }
  });

  const readTime = calculateReadTime({ title, description, routines: [] });


  //Generate categories using ONLY the description
  const filters = await generateFilters(title, description, []);


  //Create a new post with the categories and other details
  const post = await Post.create({
    title,
    description,
    media: media,
    filters: filters,
    readTime,
    owner: req.user._id,
  });

  await Expert.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });

  // Return success message with created post
  return res.status(200).json({
    message: "Post created",
    success: true,
    postId: post._id,
    userId: req.user._id,
  });
};



export const deletePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ExpressError(404, "Post not found");
  }

  const filesToDelete = [];

  // Collect images
  if (post.media?.images?.length > 0) {
    post.media.images.forEach((url) => {
      const parts = url.split("/");
      const fileWithExt = parts.pop();
      const publicId = fileWithExt.split(".")[0];
      const folder = parts.slice(parts.indexOf("upload") + 1).join("/");
      const finalId = `${folder}/${publicId}`;
      filesToDelete.push({ public_id: finalId, resource_type: "image" });
    });
  }

  // Video
  if (post.media?.video) {
    const parts = post.media.video.split("/");
    const fileWithExt = parts.pop();
    const publicId = fileWithExt.split(".")[0];
    const folder = parts.slice(parts.indexOf("upload") + 1).join("/");
    const finalId = `${folder}/${publicId}`;
    filesToDelete.push({ public_id: finalId, resource_type: "video" });
  }

  // Document
  if (post.media?.document) {
    const parts = post.media.document.split("/");
    const fileWithExt = parts.pop();
    const publicId = fileWithExt.split(".")[0];
    const folder = parts.slice(parts.indexOf("upload") + 1).join("/");
    const finalId = `${folder}/${publicId}`;
    filesToDelete.push({ public_id: finalId, resource_type: "raw" });
  }

  // Delete from Cloudinary
  await deleteCloudinaryFiles(filesToDelete);

  // Delete from DB
  await post.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Post and associated media deleted successfully",
  });
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, description } = req.body;

  // Find the existing post
  const post = await Post.findById(postId);
  if (!post) throw new ExpressError(404, "Post not found");

  // Update fields only if provided
  post.title = title || post.title;
  post.description = description || post.description;

  // Save the updated post
  await post.save();

  return res.status(200).json({
    message: "Post updated successfully",
    success: true,
    post,
  });
};

const filterPosts = async (req, res) => {
  const { filters } = req.query;
  if (!filters) {
    throw new ExpressError(400, "Filters not provided");
  }

  const categoryArray = filters
    .split(",")
    .map((cat) => cat.toLowerCase().trim());

  const posts = await Post.find({ filters: { $in: categoryArray } })
    .select("-updatedAt")
    .populate("owner", "_id profile.fullName profile.profileImage");
  res.json({ success: true, message: "Filtered posts", posts });
};

const verifyPost = async (req, res) => {
  const { id } = req.params; // Post ID
  const doctorId = req.user._id; // Doctor's (Expert's) ID from the authenticated user
  if (!doctorId) {
    return res.status(400).json({ error: "Appropriate Doctor ID is required" });
  }
  const doctor = await Expert.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  if (post.verified.includes(doctorId)) {
    return res
      .status(400)
      .json({ error: "Doctor has already verified this post" });
  }
  post.verified.push(doctorId);
  await post.save();
  const updatedPost = await Post.findById(id).populate("verified", "username");
  res.json({ message: " Post verified successfully", post: updatedPost });
};
export default {
  getAllPosts,
  createPost,
  getPostById,
  deletePost,
  updatePost,
  filterPosts,
  verifyPost,
};
