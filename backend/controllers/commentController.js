import Comment from "../models/Comment/Comment.js";
import Post from "../models/Post/Post.js";
import Routine from "../models/Routines/Routines.js";
import SuccessStory from "../models/SuccessStory/SuccessStory.js";
import ExpressError from "../utils/expressError.js";

// Generic comment creation controller
export const createCommentForModel = (Model, postType) => async (req, res) => {
  const { content, repliedTo } = req.validatedData;
  const owner = req.user._id;
  const postId = req.params.postId;

  // Edge case: repliedTo must be a valid comment on this post, or null
  let parentComment = null;
  if (repliedTo) {
    parentComment = await Comment.findById(repliedTo);
    if (!parentComment) {
      throw new ExpressError(400, "Parent comment not found");
    }
    if (parentComment.post.toString() !== postId) {
      throw new ExpressError(
        400,
        "Parent comment does not belong to this post"
      );
    }
  }

  // Increment commentsCount on Model
  const updatedPost = await Model.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 },
  });
  if (!updatedPost) {
    throw new ExpressError(404, "Post not found");
  }

  const newComment = new Comment({
    content,
    postType,
    post: postId,
    repliedTo: repliedTo || null,
    owner,
  });

  await newComment.save();

  if (repliedTo) {
    await Comment.findByIdAndUpdate(repliedTo, {
      $inc: { repliesCount: 1 },
    });
  }

  res.status(201).json(newComment);
};

// Generic get comments controller
export const getCommentsForModel = (postType) => async (req, res) => {
  const postId = req.params.postId;
  const { commentId } = req.query;
  let filter;
  if (commentId) {
    // Fetch replies to a specific comment
    filter = { repliedTo: commentId, post: postId, postType };
  } else {
    // Fetch top-level comments for the post (not replies)
    filter = { post: postId, postType, repliedTo: null };
  }
  const comments = await Comment.find(filter)
    .populate("owner", "name email")
    .sort({ createdAt: -1 });
  if (!comments) {
    throw new ExpressError(404, "Comments not found");
  }
  res.status(200).json(comments);
};

// ✅ 1. Create a new comment
export const createComment = async (req, res) => {
  try {
    const { content, repliedTo } = req.validatedData;
    const owner = req.user._id;
    const postId = req.params.postId;

    // Edge case: repliedTo must be a valid comment on this post, or null
    let parentComment = null;
    if (repliedTo) {
      parentComment = await Comment.findById(repliedTo);
      if (!parentComment) {
        return res.status(400).json({ error: "Parent comment not found" });
      }
      if (parentComment.post.toString() !== postId) {
        return res
          .status(400)
          .json({ error: "Parent comment does not belong to this post" });
      }
    }

    // Increment commentsCount on Post
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    const newComment = new Comment({
      content,
      postType: "Post",
      post: postId,
      repliedTo: repliedTo || null,
      owner,
    });

    await newComment.save();

    if (repliedTo) {
      await Comment.findByIdAndUpdate(repliedTo, {
        $inc: { repliesCount: 1 },
      });
    }

    res.status(201).json(newComment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create comment", message: err.message });
  }
};

// ✅ 2. Get all comments for a post (by postType and postId)
export const getCommentsByPost = async (req, res) => {
  try {
    const { postType, postId } = req.params;

    const comments = await Comment.find({ post: postId, postType })
      .populate("owner", "name email") // optional: adjust fields
      .populate("repliedTo")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch comments", message: err.message });
  }
};

// ✅ 3. Get single comment by ID
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id).populate("owner", "name email");

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get comment", message: err.message });
  }
};

// ✅ 4. Update a comment (only by owner)
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.validatedData;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (!comment.owner.equals(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update comment", message: err.message });
  }
};

// ✅ 5. Delete a comment (only by owner)
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (!comment.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ error: "You can't delete someone else's comment" });
    }

    await comment.deleteOne();

    if (comment.postType === "Post") {
      await Post.findByIdAndUpdate(comment.post, {
        $inc: { commentsCount: -1 },
      });
    } else if (comment.postType === "Routine") {
      await Routine.findByIdAndUpdate(comment.post, {
        $inc: { commentsCount: -1 },
      });
    } else {
      await SuccessStory.findByIdAndUpdate(comment.post, {
        $inc: { commentsCount: -1 },
      });
    }

    // Decrement repliesCount on parent if it's a reply
    if (comment.repliedTo) {
      await Comment.findByIdAndUpdate(comment.repliedTo, {
        $inc: { repliesCount: -1 },
      });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete comment", message: err.message });
  }
};
