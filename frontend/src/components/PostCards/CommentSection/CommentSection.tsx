import React, { useState, useEffect } from "react";
import { CommentSectionProps } from "./CommentSection.types";
import { Comment } from "@/types/Comment.types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useComment from "@/hooks/useComment/useComment";
import { PostType } from "@/hooks/useComment/useComment.types";

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  setComments,
  currentUserId,
  inputRef,
  postId,
  postType,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );
  const [replies, setReplies] = useState<{ [key: string]: Comment[] }>({});

  const { fetchComments, createComment, editComment, deleteComment } =
    useComment();

  useEffect(() => {
    // Fetch top-level comments
    const fetchTopLevel = async () => {
      const res = await fetchComments({
        postType: postType as PostType,
        postId,
      });
      if (res) setComments(res);
    };
    if (postId && postType) fetchTopLevel();
  }, [postId, postType]);

  // Fetch replies for a comment
  const loadReplies = async (commentId: string) => {
    const res = await fetchComments({
      postType: postType as PostType,
      postId,
      parentCommentId: commentId,
    });
    if (res) setReplies((prev) => ({ ...prev, [commentId]: res }));
  };

  // Submit top-level comment
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await createComment({
        postType: postType as PostType,
        postId,
        payload: { content: newComment },
      });
      if (res) setComments((prev) => [res, ...prev]);
      setNewComment("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Submit reply
  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent.trim()) return;
    setReplyLoading(true);
    try {
      const res = await createComment({
        postType: postType as PostType,
        postId,
        payload: { content: replyContent, repliedTo: parentId },
      });
      if (res)
        setReplies((prev) => ({
          ...prev,
          [parentId]: [res, ...(prev[parentId] || [])],
        }));
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setReplyLoading(false);
    }
  };

  // Edit comment or reply
  const handleEditSave = async (
    id: string,
    isReply: boolean,
    parentId?: string
  ) => {
    if (!editingContent.trim()) return;
    try {
      const res = await editComment({
        postType: postType as PostType,
        commentId: id,
        content: editingContent,
      });
      if (res) {
        if (isReply && parentId) {
          setReplies((prev) => ({
            ...prev,
            [parentId]: prev[parentId].map((c) => (c._id === id ? res : c)),
          }));
        } else {
          setComments((prev) => prev.map((c) => (c._id === id ? res : c)));
        }
      }
      setEditingCommentId(null);
      setEditingContent("");
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  // Delete comment or reply
  const handleDelete = async (
    id: string,
    isReply: boolean,
    parentId?: string
  ) => {
    setDeletingCommentId(id);
    try {
      await deleteComment({ postType: postType as PostType, commentId: id });
      if (isReply && parentId) {
        setReplies((prev) => ({
          ...prev,
          [parentId]: prev[parentId].filter((c) => c._id !== id),
        }));
      } else {
        setComments((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  // UI rendering
  const renderComment = (
    comment: Comment,
    isReply = false,
    parentId?: string
  ) => {
    const isOwner = comment.owner._id === currentUserId;
    const isEditing = editingCommentId === comment._id;
    return (
      <Box
        key={comment._id}
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: isOwner ? "#f3f3f3" : "#fff",
          ml: isReply ? 4 : 0,
        }}
      >
        <Typography fontWeight="bold">
          {comment.owner.profile?.fullName || comment.owner.email || "User"}
        </Typography>
        {isEditing ? (
          <>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              sx={{ mt: 1 }}
            />
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleEditSave(comment._id, isReply, parentId)}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                size="small"
                variant="text"
                color="inherit"
                onClick={() => {
                  setEditingCommentId(null);
                  setEditingContent("");
                }}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Typography sx={{ mt: 1 }}>{comment.content}</Typography>
        )}
        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
          <Button
            size="small"
            onClick={() => {
              setReplyingTo(comment._id);
              setReplyContent("");
              loadReplies(comment._id);
            }}
          >
            Reply
          </Button>
          {isOwner && !isEditing && (
            <>
              <Button
                size="small"
                onClick={() => {
                  setEditingCommentId(comment._id);
                  setEditingContent(comment.content);
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(comment._id, isReply, parentId)}
                disabled={deletingCommentId === comment._id}
              >
                {deletingCommentId === comment._id ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
        </Box>
        {/* Reply input */}
        {replyingTo === comment._id && !isReply && (
          <Box sx={{ mt: 2, ml: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => handleReplySubmit(comment._id)}
              disabled={replyLoading || !replyContent.trim()}
            >
              {replyLoading ? "Replying..." : "Reply"}
            </Button>
          </Box>
        )}
        {/* Render replies */}
        {replies[comment._id] && replies[comment._id].length > 0 && (
          <Box sx={{ mt: 2 }}>
            {replies[comment._id].map((reply) =>
              renderComment(reply, true, comment._id)
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        inputRef={inputRef}
      />
      <Button
        variant="contained"
        sx={{ mt: 1 }}
        onClick={handleCommentSubmit}
        disabled={loading || !newComment.trim()}
      >
        {loading ? "Posting..." : "Post Comment"}
      </Button>
      <Box sx={{ mt: 3 }}>
        {comments.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No comments yet. Be the first to comment!
          </Typography>
        )}
        {comments.map((comment) => renderComment(comment))}
      </Box>
    </Box>
  );
};

export default CommentSection;
