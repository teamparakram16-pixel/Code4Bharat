import { CardContent, Typography, Box, Chip } from "@mui/material";
import { motion } from "framer-motion";
import MediaPreview from "../../../MediaPreview/MediaPreview";
import type { MediaUpload } from "../../../MediaPreview/MediaPreview.types";
import { SuccessStoryCardProps } from "../SuccessStoryPostCard.types";

export const PostContent = ({ 
  post, 
  onMediaClick 
}: { 
  post: SuccessStoryCardProps['post'], 
  onMediaClick: SuccessStoryCardProps['onMediaClick'] 
}) => {
  return (
    <CardContent sx={{ pt: 0, pb: 2 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
        {post.title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'grey.700', mb: 2 }}>
        {post.description}
      </Typography>
      {post.media && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: 16 }}
        >
          <MediaPreview
            media={post.media as MediaUpload}
            onMediaClick={onMediaClick}
          />
        </motion.div>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {post.filters.map((tag) => (
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
  );
};