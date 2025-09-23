import {
  Avatar,
  Card,
  CardContent,
  CardActions,
  Chip,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  CardHeader,
  Collapse,
  Box,
  Badge,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  Bookmark,
  BookmarkBorder,
  MenuBook,
  AccessTime,
  MoreVert,
  Visibility,
  Report,
  Edit,
  Delete,
  VolumeUp,
} from "@mui/icons-material";
import TextToSpeech from "../../TextToSpeech/TextToSpeech";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef, FC } from "react";
import MediaPreview from "../../MediaPreview/MediaPreview";
import { MediaUpload } from "../../MediaPreview/MediaPreview.types";
import ShareMenu from "../../ShareMenu/ShareMenu";
import { GeneralPostCardProps } from "./GeneralPostCard.types";
import CommentSection from "../CommentSection/CommentSection";
import { Comment } from "@/types/Comment.types";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { useBookmarks } from "../../../hooks/useBookmarks/useBookmarks";
import { useLikes } from "../../../hooks/useLikes/useLikes";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: (theme.shape.borderRadius as any) * 2,
  overflow: "hidden",
  transition: "all 0.3s ease",
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.grey[200]}`,
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-4px)",
  },
}));

const PostTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  lineHeight: 1.4,
  color: theme.palette.grey[900],
  marginBottom: theme.spacing(1.5),
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const PostDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
  fontSize: "0.95rem",
  lineHeight: 1.6,
  marginBottom: theme.spacing(2),
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const GeneralPostCard: FC<GeneralPostCardProps> = ({
  post,
  currentUserId,
  onMediaClick,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  // const [saved, setSaved] = useState(isSaved);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [viewCount] = useState(Math.floor(Math.random() * 1000));
  const { isBookmarked, addBookmark, removeBookmark, isAdding } = useBookmarks();
  const { isLiked: isPostLiked, likePost, unlikePost, isLiking } = useLikes();
  const [isExpanded, setIsExpanded] = useState(false);

  const bookmarked = isBookmarked(post._id);
  const liked = isPostLiked(post._id);

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  const shouldreducesize = post.description.length > 200;

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      removeBookmark(post._id);
    } else {
      addBookmark(post._id);
    }
  };


  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleCommentClick = () => {
    setCommentOpen(!commentOpen);
    if (!commentOpen && commentInputRef.current) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  const toggleLike = async () => {
    if (liked) {
      await unlikePost(post._id);
      setLikeCount(prev => Math.max(0, prev - 1));
    } else {
      await likePost(post._id);
      setLikeCount(prev => prev + 1);
    }
  };

  // const toggleSave = () => {
  //   setSaved(!saved);
  // };

  const handleReport = () => {
    // Report functionality
    handleMenuClose();
  };

  const menuOpen = Boolean(menuAnchorEl);
  const shareOpen = Boolean(shareAnchorEl);
  return (
    <StyledCard>
      {/* Author section */}
      <CardHeader
        avatar={
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: "#4CAF50",
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              />
            }
          >
            <Avatar
              src={post.owner.profile.profileImage}
              sx={{
                width: 48,
                height: 48,
                border: "2px solid white",
                boxShadow: theme.shadows[1],
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.3s",
                },
              }}
            >
              {post.owner.profile.fullName[0]}
            </Avatar>
          </Badge>
        }
        action={
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ color: "grey.600" }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        }
        title={
          <Typography variant="subtitle1" fontWeight={600}>
            {post.owner.profile.fullName}
          </Typography>
        }
        subheader={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Tooltip title="Posted time" arrow>
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "grey.600",
                }}
              >
                <AccessTime fontSize="inherit" sx={{ mr: 0.5 }} />
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </Typography>
            </Tooltip>
            <Typography variant="caption" sx={{ color: "grey.400" }}>
              •
            </Typography>
            <Tooltip title="Reading time" arrow>
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "grey.600",
                }}
              >
                <MenuBook fontSize="inherit" sx={{ mr: 0.5 }} />
                {post.readTime}
              </Typography>
            </Tooltip>
          </Box>
        }
        sx={{
          pb: 1,
          "& .MuiCardHeader-action": {
            alignSelf: "center",
          },
        }}
      />

      {/* Post content */}
      <CardContent sx={{ pt: 0, pb: 2 }}>
        <PostTitle>{post.title}</PostTitle>

        <PostDescription>
          {shouldreducesize && !isExpanded
            ? `${post.description.substring(0, 200)}...`
            : post.description}
          {shouldreducesize && (
            <button
              onClick={toggleReadMore}
              style={{
                marginLeft: "8px",
                background: "transparent",
                border: "none",
                color: "#1c65f7ff",
                cursor: "pointer",
                padding: "2px 6px",
                fontSize: "0.9rem",
                fontWeight: "500",
                borderRadius: "4px",
                transition: "all 0.2s ease",
              }}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )
          }
        </PostDescription>

        {/* Media display */}
        {post.media && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: theme.spacing(2) }}
          >
            <MediaPreview
              media={post.media as MediaUpload}
              onMediaClick={onMediaClick}
            />
          </motion.div>
        )}

        {/* Tags */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {post.filters.map((tag: string) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              size="small"
              sx={{
                backgroundColor: "rgba(5, 150, 105, 0.1)",
                color: "rgb(5, 150, 105)",
                "&:hover": {
                  backgroundColor: "rgba(5, 150, 105, 0.2)",
                },
                fontSize: "0.7rem",
                height: "24px",
              }}
            />
          ))}
        </Box>
      </CardContent>

      {/* Stats and Actions */}
      <CardActions
        sx={{
          px: 2,
          py: 1,
          bgcolor: "grey.50",
          borderTop: `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Left side - Like, Comment, Share */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
            <Tooltip title={liked ? "Unlike" : "Like"} arrow>
              <ActionButton
                size="small"
                onClick={toggleLike}
                disabled={isLiking}
                sx={{
                  color: liked ? "#f44336" : "grey.600", // Red color when liked
                }}
              >
                {liked ? <Favorite /> : <FavoriteBorder />}
                <Typography variant="body2" sx={{ ml: 0.5, minWidth: 20 }}>
                  {likeCount}
                </Typography>
              </ActionButton>
            </Tooltip>

            <Tooltip title="Comments" arrow>
              <ActionButton
                size="small"
                onClick={handleCommentClick}
                sx={{
                  color: "grey.600",
                }}
              >
                <ChatBubbleOutline />
                <Typography variant="body2" sx={{ ml: 0.5, minWidth: 20 }}>
                  {post.commentsCount}
                </Typography>
              </ActionButton>
            </Tooltip>

            <Tooltip title="Share" arrow>
              <ActionButton
                size="small"
                onClick={handleShareClick}
                sx={{
                  color: "grey.600",
                }}
              >
                <Share />
              </ActionButton>
            </Tooltip>

            <TextToSpeech 
              text={post.description} 
              label={`Read "${post.title}" aloud`} 
            />
          </Box>

          {/* Right side - Bookmark and Views (only for author) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title={bookmarked ? "Remove Bookmark" : "Add Bookmark"} arrow>
              <span>
                <ActionButton
                  size="small"
                  onClick={handleBookmarkToggle}
                  disabled={isAdding}
                  sx={{
                    color: bookmarked ? "error.main" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  {bookmarked ? (
                    <Bookmark sx={{ color: "error.main" }} />
                  ) : (
                    <BookmarkBorder sx={{ color: "rgba(255, 0, 0, 0.2)" }} />
                  )}
                </ActionButton>
              </span>
            </Tooltip>

            {post.owner._id === currentUserId && (
              <Tooltip title="Views" arrow>
                <Typography
                  variant="caption"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "grey.600",
                    ml: 1,
                  }}
                >
                  <Visibility fontSize="small" sx={{ mr: 0.5 }} />
                  {viewCount}
                </Typography>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardActions>

      {/* Comment Section */}
      <Collapse in={commentOpen} timeout="auto" unmountOnExit>
        <Divider />
        <CommentSection
          comments={comments}
          setComments={setComments}
          currentUserId={currentUserId}
          inputRef={commentInputRef}
          postId={post._id}
          postType="Post"
        />



      </Collapse>

      <ShareMenu
        anchorEl={shareAnchorEl}
        open={shareOpen}
        onClose={handleShareClose}
        postTitle={post.title}
      />

      {/* Post Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
          },
        }}
      >
        <MenuItem
          onClick={handleShareClick}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(5, 150, 105, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "rgb(5, 150, 105)" }}>
            <Share fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Share" />
        </MenuItem>

        <MenuItem
          onClick={handleReport}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(5, 150, 105, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "rgb(5, 150, 105)" }}>
            <Report fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Report" />
        </MenuItem>

        {onEdit && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onEdit();
              navigate(`/gposts/update/${post._id}`);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(5, 150, 105, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "rgb(5, 150, 105)" }}>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
        )}

        {onDelete && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onDelete();
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete" sx={{ color: "error.main" }} />
          </MenuItem>
        )}
      </Menu>
    </StyledCard>
  );
};

export default GeneralPostCard;
