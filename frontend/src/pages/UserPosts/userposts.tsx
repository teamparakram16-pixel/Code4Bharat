import {  useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  Container,
  TextField,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import UserSuccessStoryCard from "@/components/SuccessStoriesCards/userSuccessStoriescards";
import { useUserSuccessStories } from "@/hooks/useUserSuccessStories/useUserSuccessStories";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";
import {
  VerifiersDialog,
  InvalidDialog,
} from "@/components/PostCards/SuccessStoryPostCard/Sections/VerificationDialogs";
import SearchIcon from "@mui/icons-material/Search";

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(8),
  padding: theme.spacing(4),
  background: "linear-gradient(135deg, #f5f7fa 0%, #e4f0f9 100%)",
  borderRadius: (theme.shape.borderRadius as any) * 2,
  boxShadow: theme.shadows[2],
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: (theme.shape.borderRadius as any) * 2,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
  background: "white",
  maxWidth: 700,
  marginLeft: "auto",
  marginRight: "auto",
}));

const PostsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
  width: "100%",
}));

const UserSuccessStoriesPage: React.FC = () => {
  const { stories, loading } = useUserSuccessStories();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Dialog state
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<
    number | null
  >(null);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);
  const [verifiersDialogOpen, setVerifiersDialogOpen] = useState(false);
  const [verifiersDialogData, setVerifiersDialogData] = useState<any[]>([]);
  const [verifiersDialogPostTitle, setVerifiersDialogPostTitle] = useState("");
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);
  const [_invalidPostId, setInvalidPostId] = useState<string | null>(null);
  const [invalidReason, setInvalidReason] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Media dialog handlers
  const openMediaViewer = (mediaIndex: number, images: string[]) => {
    setSelectedMediaImageIndex(mediaIndex);
    setMediaDialogImages(images);
    setOpenMediaDialog(true);
  };
  const closeMediaViewer = () => {
    setSelectedMediaImageIndex(null);
    setMediaDialogImages([]);
    setOpenMediaDialog(false);
  };

  // Dialog handlers
  const handleVerifiersDialogOpen = (verifiers: any[], postTitle: string) => {
    setVerifiersDialogData(verifiers);
    setVerifiersDialogPostTitle(postTitle);
    setVerifiersDialogOpen(true);
  };
  const handleInvalidDialogOpen = (postId: string) => {
    setInvalidPostId(postId);
    setInvalidDialogOpen(true);
  };
  const confirmInvalid = async () => {
    // TODO: Replace with user-specific API call for invalidating a post
    setVerificationLoading(true);
    setTimeout(() => {
      setVerificationLoading(false);
      setInvalidDialogOpen(false);
      setInvalidReason("");
      setInvalidPostId(null);
    }, 1000);
  };

  // Filtered posts
  const filteredStories = stories.filter(
    (story) =>
      story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (story.filters || []).some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #f8fafc, #f1f5f9)",
        py: 6,
        width: "100vw",
        px: 0,
      }}
    >
      <Container maxWidth={false}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSection>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 3,
                background: "linear-gradient(45deg, #059669 30%, #10b981 90%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 1.2,
              }}
            >
              My Success Stories
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.25rem" },
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              All your Ayurveda journey posts in one place
            </Typography>
          </HeroSection>
          <SearchContainer elevation={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search stories by title, content or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, backgroundColor: "background.paper" },
              }}
              sx={{ flexGrow: 1, maxWidth: { md: "600px" } }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                component={Link}
                to="/user/success-stories/create"
                variant="contained"
                color="primary"
                startIcon={<Add />}
                size={isMobile ? "medium" : "large"}
                sx={{
                  background:
                    "linear-gradient(45deg, #059669 30%, #10b981 90%)",
                  boxShadow: "0 4px 6px rgba(5, 150, 105, 0.2)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 8px rgba(5, 150, 105, 0.3)",
                  },
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {isMobile ? "Create" : "Create Story"}
              </Button>
            </Box>
          </SearchContainer>
        </motion.div>
        <PostsContainer>
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* You can use a skeleton loader here if available */}
                  <Box
                    sx={{
                      maxWidth: 700,
                      mx: "auto",
                      width: "100%",
                      height: 180,
                      bgcolor: "grey.100",
                      borderRadius: 2,
                    }}
                  />
                </motion.div>
              ))
          ) : filteredStories.length > 0 ? (
            <AnimatePresence>
              {filteredStories.map((story) => (
                <motion.div
                  key={story._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ maxWidth: 700, mx: "auto", width: "100%" }}>
                    <UserSuccessStoryCard
                      story={story}
                      isLiked={false}
                      isSaved={false}
                      currentUserId={story.owner?._id ?? ""}
                      addVerifiedExpert={() => {}}
                      onMediaClick={openMediaViewer}
                      menuItems={[]}
                      handleVerifiersDialogOpen={handleVerifiersDialogOpen}
                      handleInvalidDialogOpen={handleInvalidDialogOpen}
                      verificationLoading={verificationLoading}
                    />
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <Typography variant="body1">No success stories found.</Typography>
            </motion.div>
          )}
        </PostsContainer>
      </Container>
      {/* Media Viewer Dialog */}
      <MediaViewerDialog
        open={openMediaDialog}
        images={mediaDialogImages}
        selectedImageIndex={selectedMediaImageIndex || 0}
        onClose={closeMediaViewer}
      />
      {/* Verifiers Dialog */}
      <VerifiersDialog
        open={verifiersDialogOpen}
        onClose={() => {
          setVerifiersDialogOpen(false);
          setVerifiersDialogData([]);
        }}
        verifiers={verifiersDialogData}
        postTitle={verifiersDialogPostTitle}
      />
      {/* Invalid Dialog */}
      <InvalidDialog
        open={invalidDialogOpen}
        onClose={() => {
          setInvalidDialogOpen(false);
          setInvalidReason("");
        }}
        onConfirm={confirmInvalid}
        reason={invalidReason}
        setReason={setInvalidReason}
        loading={verificationLoading}
      />
    </Box>
  );
};

export default UserSuccessStoriesPage;
