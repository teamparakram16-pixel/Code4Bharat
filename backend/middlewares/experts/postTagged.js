import SuccessStory from "../../models/SuccessStory/SuccessStory.js";
import ExpressError from "../../utils/expressError.js";

export const checkIsTaggedAndVerified = async (req, res, next) => {
  const { id } = req.params;
  const { action, reason } = req.body; // 'accept' or 'reject'

  if (!action || (action !== "accept" && action !== "reject")) {
    throw new ExpressError(400, "Action must be either 'accept' or 'reject'");
  }

  if (action === "reject" && !reason.trim()) {
    throw new ExpressError(400, "Reason is required for rejection");
  }

  const successPost = await SuccessStory.findById(id);

  if (!successPost) {
    throw new ExpressError(404, "Post not found");
  }

  // Store for further use in subsequent middleware or handlers
  req.successStory = successPost;

  const isTagged = successPost.tagged.some((expertId) =>
    expertId.equals(req.user._id)
  );

  const isAlreadyVerified = successPost.verified.some(
    (v) => v.expert && v.expert.equals(req.user._id)
  );

  const isAlreadyRejected = successPost.rejections.some(
    (rej) => rej.expert && rej.expert.equals(req.user._id)
  );

  const isTaggingEnabled = successPost.tagged.length > 0;

  // Prevent duplicate actions
  if (isAlreadyVerified) {
    throw new ExpressError(403, "You have already verified this post");
  }
  if (isAlreadyRejected) {
    throw new ExpressError(403, "You have already rejected this post");
  }

  // Accept (verify) logic
  if (action === "accept") {
    // Case 1: No tagging, less than 5 verifications, and not already verified
    if (
      !isTaggingEnabled &&
      successPost.verified.length + successPost.rejections.length < 5
    ) {
      return next();
    }
    // Case 2: Tagging enabled, current expert is tagged
    if (isTaggingEnabled && isTagged) {
      return next();
    }
    // Edge: Tagging enabled, expert is NOT tagged
    if (isTaggingEnabled && !isTagged) {
      throw new ExpressError(403, "You are not tagged to verify this post");
    }
    // Fallback
    throw new ExpressError(403, "Access denied");
  }

  // Reject logic
  if (action === "reject") {
    // Case 1: No tagging, less than 5 verifications, and not already verified
    if (
      !isTaggingEnabled &&
      successPost.verified.length + successPost.rejections.length < 5
    ) {
      return next();
    }
    // Case 2: Tagging enabled, current expert is tagged
    if (isTaggingEnabled && isTagged) {
      return next();
    }
    // Edge: Tagging enabled, expert is NOT tagged
    if (isTaggingEnabled && !isTagged) {
      throw new ExpressError(403, "You are not tagged to verify this post");
    }
    // Fallback
    throw new ExpressError(403, "Access denied");
  }

  // If action is not specified or invalid
  throw new ExpressError(400, "Invalid action");
};
