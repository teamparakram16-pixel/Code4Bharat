import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Add, Edit, Delete, CheckCircle } from "@mui/icons-material";
import { Filter } from "@/components/Filter/Filter";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";
import SuccessStoryPostCard from "@/components/PostCards/SuccessStoryPostCard/SuccessStoryPostCard";
import { SuccessStoryType } from "@/types/SuccessStory.types";
import useSuccessStory from "@/hooks/useSuccessStory/useSuccessStory";
import { useAuth } from "@/context/AuthContext";
import SearchIcon from "@mui/icons-material/Search";
import NoPostFound from "../../components/PostCards/NoPostFound/NoPostFound";
import { styled } from "@mui/material/styles";
import {
  VerifiersDialog,
  InvalidDialog,
} from "@/components/PostCards/SuccessStoryPostCard/Sections/VerificationDialogs";
import { VerificationDialogDataType } from "@/components/PostCards/SuccessStoryPostCard/SuccessStoryPostCard.types";

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

export function AllSuccessStoriesPosts() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { getAllSuccessStories, filterSearch, verifySuccessStory, deleteSuccessStory } =
    useSuccessStory();

  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [_openEditDialog, setOpenEditDialog] = useState(false);
  const [_currentPost, setCurrentPost] = useState<SuccessStoryType | null>(
    null
  );
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<
    number | null
  >(null);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStoryType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [verifiersDialogOpen, setVerifiersDialogOpen] = useState(false);
  const [verifiersDialogData, setVerifiersDialogData] = useState<any[]>([]);
  const [verifiersDialogPostTitle, setVerifiersDialogPostTitle] = useState("");
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);
  const [invalidPostId, setInvalidPostId] = useState<string | null>(null);
  const [invalidReason, setInvalidReason] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);

  const fetchAllPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSuccessStories();
      setSuccessStories(response.successStories);
      setUserId(response.userId);
      setIsLoading(false);
    } catch (error: any) {
      console.error(error.message);
      if (error.status === 401) navigate("/auth");
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleEdit = (post: SuccessStoryType) => {
    setCurrentPost(post);
    setOpenEditDialog(true);
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteSuccessStory(postId);
      setSuccessStories((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
    } catch (error) {
      console.error("Failed to delete success story:", error);
    }
  };


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

  const isPostAuthor = (post: SuccessStoryType) => {
    return post.owner._id === userId;
  };

  const addVerifiedExpert = (postId: string, expert: any) => {
    setSuccessStories((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
            ...post,
            verified: [...post.verified, expert],
            verifyAuthorization: false,
          }
          : post
      )
    );
  };

  const applyFilters = async (filters: string) => {
    try {
      setIsLoading(true);
      const response = await filterSearch(filters);
      setSuccessStories(response.successStories);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Filter failed:", error.message);
      if (error.status === 401) navigate("/auth");
    }
  };

  const filteredPosts = successStories.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.filters.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Handler to open verifiers dialog from any card
  const handleVerifiersDialogOpen = (
    verifiers: VerificationDialogDataType[],
    postTitle: string
  ) => {
    setVerifiersDialogData(verifiers);
    setVerifiersDialogPostTitle(postTitle);
    setVerifiersDialogOpen(true);
  };

  // Handler to open invalid dialog from any card
  const handleInvalidDialogOpen = (postId: string) => {
    setInvalidPostId(postId);
    setInvalidDialogOpen(true);
  };

  // Handler to confirm invalid (should be implemented to call API)
  const confirmInvalid = async () => {
    if (!invalidPostId) return;
    const post = successStories.find((p) => p._id === invalidPostId);
    if (!post) return;
    if (!invalidReason.trim()) {
      // Optionally show error toast here
      return;
    }
    setVerificationLoading(true);
    try {
      const response = await verifySuccessStory(
        post._id,
        "reject",
        invalidReason
      );
      if (response?.success) {
        // Update the local state for the post
        setSuccessStories((prev) =>
          prev.map((p) =>
            p._id === post._id
              ? {
                ...p,
                verifyAuthorization: false,
                alreadyRejected: true,
                rejections: response.data.successStory.rejections,
              }
              : p
          )
        );
        // Open the verifiers dialog with rejection data
        handleVerifiersDialogOpen(
          response.data.successStory.rejections,
          post.title
        );
        setInvalidDialogOpen(false);
        setInvalidReason("");
        setInvalidPostId(null);
      }
    } finally {
      setVerificationLoading(false);
    }
  };

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
        {/* Hero Section */}
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
              Success Stories
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
              Real people, real results with Ayurveda
            </Typography>
          </HeroSection>

          {/* Search and Action Bar */}
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
                sx: {
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                },
              }}
              sx={{
                flexGrow: 1,
                maxWidth: { md: "600px" },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Filter applyFilters={applyFilters} getAllPosts={fetchAllPosts} />
              {role === "user" && (
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
              )}
            </Box>
          </SearchContainer>
        </motion.div>

        {/* Posts Container */}
        <PostsContainer>
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostCardSkeleton />
                </motion.div>
              ))
          ) : filteredPosts.length > 0 ? (
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ maxWidth: 700, mx: "auto", width: "100%" }}>
                    <SuccessStoryPostCard
                      post={post}
                      isLiked={Math.floor(Math.random() * 2) === 1}
                      isSaved={Math.floor(Math.random() * 2) === 1}
                      currentUserId={userId}
                      addVerifiedExpert={addVerifiedExpert}
                      onMediaClick={openMediaViewer}
                      handleVerifiersDialogOpen={handleVerifiersDialogOpen}
                      handleInvalidDialogOpen={handleInvalidDialogOpen}
                      setVerificationLoading={setVerificationLoading}
                      verificationLoading={verificationLoading}
                      // onDelete={() => handleDelete(post._id)}
                      menuItems={[
                        ...(isPostAuthor(post)
                          ? [
                            {
                              label: "Edit",
                              icon: <Edit fontSize="small" />,
                              action: () => {
                                navigate(`/successstory/update/${post._id}`);
                                handleEdit(post);
                              }
                            },
                            {
                              label: "Delete",
                              icon: <Delete fontSize="small" />,
                              action: () => handleDelete(post._id),
                            },
                          ]
                          : []),
                        ...(role === "expert" && post.verifyAuthorization
                          ? [
                            {
                              label: "Verify",
                              icon: <CheckCircle fontSize="small" />,
                              action: () => { }, // Handled in the card component
                            },
                          ]
                          : []),
                      ]}
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
              <NoPostFound
                message="No stories found. Try adjusting your search or filters to find what you're looking for."
                onReset={() => {
                  setSearchQuery("");
                  fetchAllPosts();
                }}
              />
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

      {/* Verifiers Dialog at top level */}
      <VerifiersDialog
        open={verifiersDialogOpen}
        onClose={() => {
          setVerifiersDialogOpen(false);
          setVerifiersDialogData([]);
        }}
        verifiers={verifiersDialogData}
        postTitle={verifiersDialogPostTitle}
      />

      {/* Invalid Dialog at top level */}
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
}
