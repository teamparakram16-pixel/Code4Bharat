import { CardActions, IconButton, Typography, Box, Tooltip } from "@mui/material";
import { 
  Favorite, 
  FavoriteBorder, 
  ChatBubbleOutline, 
  Share, 
  Bookmark, 
  BookmarkBorder, 
  Visibility 
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export const PostActions = ({
  liked,
  likeCount,
  commentCount,
  viewCount,
  saved,
  isAuthor,
  toggleLike,
  handleCommentClick,
  handleShareClick,
  toggleSave
}: {
  liked: boolean,
  likeCount: number,
  commentCount: number,
  viewCount: number,
  saved: boolean,
  isAuthor: boolean,
  toggleLike: () => void,
  handleCommentClick: () => void,
  handleShareClick: (event: React.MouseEvent<HTMLElement>) => void,
  toggleSave: () => void
}) => {
  const theme = useTheme();
  
  return (
    <CardActions sx={{ 
      px: 2,
      py: 1,
      bgcolor: "grey.50",
      borderTop: `1px solid ${theme.palette.grey[200]}`,
    }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        width: "100%"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <Tooltip title={liked ? "Unlike" : "Like"} arrow>
            <IconButton
              size="small"
              onClick={toggleLike}
              sx={{
                color: liked ? "error.main" : "grey.600",
              }}
            >
              {liked ? <Favorite /> : <FavoriteBorder />}
              <Typography variant="body2" sx={{ ml: 0.5, minWidth: 20 }}>{likeCount}</Typography>
            </IconButton>
          </Tooltip>

          <Tooltip title="Comments" arrow>
            <IconButton
              size="small"
              onClick={handleCommentClick}
              sx={{
                color: "grey.600",
              }}
            >
              <ChatBubbleOutline />
              <Typography variant="body2" sx={{ ml: 0.5, minWidth: 20 }}>{commentCount}</Typography>
            </IconButton>
          </Tooltip>

          <Tooltip title="Share" arrow>
            <IconButton
              size="small"
              onClick={handleShareClick}
              sx={{
                color: "grey.600",
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={saved ? "Unsave" : "Save"} arrow>
            <IconButton
              size="small"
              onClick={toggleSave}
              sx={{
                color: saved ? "warning.main" : "grey.600",
              }}
            >
              {saved ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Tooltip>
          
          {isAuthor && (
            <Tooltip title="Views" arrow>
              <Typography variant="caption" sx={{ 
                display: "flex", 
                alignItems: "center", 
                color: "grey.600",
                ml: 1,
              }}>
                <Visibility fontSize="small" sx={{ mr: 0.5 }} />
                {viewCount}
              </Typography>
            </Tooltip>
          )}
        </Box>
      </Box>
    </CardActions>
  );
};