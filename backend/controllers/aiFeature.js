import axios from "axios";
import Post from "../models/Post/Post.js";
import Routine from "../models/Routines/Routines.js";
import SuccessStory from "../models/SuccessStory/SuccessStory.js";
import { normalizePostForAI } from "../utils/normalizePostForAI.js";

export const aiQuerySearch = async (req, res) => {
  const { prompt } = req.query;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      success: false,
      message: "Prompt is required and must be a string.",
    });
  }

  // Fetch all post types
  const [posts, routines, successStories] = await Promise.all([
    Post.find({}),
    Routine.find({}),
    SuccessStory.find({}),
  ]);

  // Normalize all posts
  const formattedPosts = posts.map((post) => normalizePostForAI(post, "post"));
  const formattedRoutines = routines.map((routine) =>
    normalizePostForAI(routine, "routine")
  );
  const formattedStories = successStories.map((story) =>
    normalizePostForAI(story, "successStory")
  );

  const allPosts = [
    ...formattedPosts,
    ...formattedRoutines,
    ...formattedStories,
  ];

  const aiBody = {
    ApiKey: !req.user?.premiumUser
      ? process.env.AI_QUERY_PREMIUM_API_KEY
      : process.env.AI_QUERY_FREE_API_KEY,
    prompt,
    posts: allPosts,
  };

  // AI search API call
  const aiResponse = await axios.post(process.env.AI_QUERY_MODEL, aiBody);

  const results = {
    generalPosts: [], // Will contain posts with type "post"
    routines: [], // Will contain posts with type "routine"
    successStories: [], // Will contain posts with type "successStory"
  };

  // Map of type values to results object keys
  const typeToKeyMap = {
    post: "generalPosts",
    routine: "routines",
    successStory: "successStories",
  };

  for (const { postId, type } of aiResponse.data.results) {
    // Skip if type is not recognized
    if (!typeToKeyMap.hasOwnProperty(type)) continue;

    let data;
    const resultsKey = typeToKeyMap[type];

    switch (type) {
      case "successStory":
        data = await SuccessStory.findById(postId)
          .select("-updatedAt")
          .populate("owner", "_id profile.fullName profile.profileImage")
          .populate(
            "tagged",
            "_id profile.fullName profile.profileImage profile.expertType"
          )
          .populate(
            "verified.expert",
            "_id profile.fullName profile.profileImage profile.expertType"
          )
          .populate(
            "rejections.expert",
            "_id profile.fullName profile.profileImage profile.expertType"
          );
        if (data) {
          data = data.toObject();
          const userId = req.user?._id?.toString();
          const isTagged = data.tagged.some(
            (expert) => expert._id.toString() === userId
          );
          const alreadyVerified = data.verified.some(
            (v) => v.expert && v.expert._id.toString() === userId
          );
          const alreadyRejected = data.rejections.some(
            (rej) => rej.expert && rej.expert._id.toString() === userId
          );
          data.verifyAuthorization =
            req.user &&
            req.user.role === "expert" &&
            ((data.tagged.length === 0 &&
              data.verified.length + data.rejections.length < 5 &&
              !alreadyVerified &&
              !alreadyRejected) ||
              (isTagged && !alreadyVerified && !alreadyRejected));
          data.alreadyVerified = alreadyVerified;
          data.alreadyRejected = alreadyRejected;
        }
        break;

      case "routine":
        data = await Routine.findById(postId)
          .select("-updatedAt")
          .populate("owner", "_id profile.fullName profile.profileImage");
        break;

      case "post":
        data = await Post.findById(postId)
          .select("-updatedAt")
          .populate("owner", "_id profile.fullName profile.profileImage");
        break;
    }

    if (data) {
      results[resultsKey].push(data);
    }
  }

  res.status(200).json({
    success: true,
    message: "AI search successful",
    filteredPosts: results,
    userId: req.user?._id,
  });
};

export default {
  aiQuerySearch,
};
