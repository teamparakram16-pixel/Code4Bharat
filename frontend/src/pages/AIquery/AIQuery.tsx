import { useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
} from "@mui/icons-material";
import NoPostFound from "@/components/PostCards/NoPostFound/NoPostFound";
import { motion, AnimatePresence } from "framer-motion";

import {
  GeneralPostCardSkeleton,
  RoutinePostCardSkeleton,
  SuccessStoryCardSkeleton,
} from "@/components/PostCards/PostCardSkeletons";
import { useNavigate } from "react-router-dom";
import GeneralPostCard from "@/components/PostCards/GeneralPostCard/GeneralPostCard";
import useAiSearch from "@/hooks/useAiSearch/useAiSearch";
import RoutinePostCard from "@/components/PostCards/RoutinePostCard/RoutinePostCard";
import SuccessStoryPostCard from "@/components/PostCards/SuccessStoryPostCard/SuccessStoryPostCard";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";
import VoiceToText from "@/components/VoiceToText/VoiceToText";
import { UserOrExpertDetailsType } from "@/types";
import {
  VerifiersDialog,
  InvalidDialog,
} from "@/components/PostCards/SuccessStoryPostCard/Sections/VerificationDialogs";

const AISearchPage = () => {
  const { searchWithAi } = useAiSearch();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string>("");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingTranscript, setPendingTranscript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    generalPosts: any[];
    routines: any[];
    successStories: any[];
  } | null>(null);

  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<
    number | null
  >(null);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);

  // Dialog state for success story verification
  const [verifiersDialogOpen, setVerifiersDialogOpen] = useState(false);
  const [verifiersDialogData, setVerifiersDialogData] = useState<any[]>([]);
  const [verifiersDialogPostTitle, setVerifiersDialogPostTitle] = useState("");
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleTranscriptChange = (transcript: string) => {
    setPendingTranscript(transcript);
    setQuery(transcript);
  };

  useEffect(() => {
    if (pendingTranscript !== null && inputRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated before focusing/selecting
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(pendingTranscript.length, pendingTranscript.length);
        }
        setPendingTranscript(null);
      });
    }
  }, [pendingTranscript]);

  const handleSearch = async () => {
    try {
      if (!query.trim()) return;

      setIsLoading(true);
      setResults(null);

      const results = await searchWithAi(query);

      setResults(results.filteredPosts);
      setUserId(results.userId);
    } catch (error: any) {
      if (error.status === 401) navigate("/auth");
      else if (error.status === 403) navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
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

  const handleSearchReset = () =>{
    setQuery("");
    setResults(null);
};
  // const handleNextImage = () => {
  //   if (mediaDialogImages.length > 0) {
  //     setSelectedMediaImageIndex(
  //       (prev) => (prev ? prev + 1 : 0) % mediaDialogImages.length
  //     );
  //   }
  // };

  // const handlePrevImage = () => {
  //   if (mediaDialogImages.length > 0) {
  //     setSelectedMediaImageIndex(
  //       (prev) =>
  //         (prev ? prev - 1 + mediaDialogImages.length : 0) %
  //         mediaDialogImages.length
  //     );
  //   }
  // };

  const addVerifiedExpert = (
    postId: string,
    expert: UserOrExpertDetailsType
  ) => {
    setResults((prev) => {
      if (!prev) return prev;

      const updatedSuccessStories = prev.successStories.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            verified: [...post.verified, expert],
          };
        }
        return post;
      });

      return {
        ...prev,
        successStories: updatedSuccessStories,
      };
    });
  };

  // Handler to open verifiers dialog
  const handleVerifiersDialogOpen = (verifiers: any[], postTitle: string) => {
    setVerifiersDialogData(verifiers);
    setVerifiersDialogPostTitle(postTitle);
    setVerifiersDialogOpen(true);
  };

  // Handler to open invalid dialog
  const handleInvalidDialogOpen = (_postId: string) => {
    setInvalidDialogOpen(true);
  };

  // Handler to confirm invalid (should be implemented to call API)
  const confirmInvalid = async () => {
    if (!invalidReason.trim()) return;
    setVerificationLoading(true);
    try {
      // You may want to call verifySuccessStory here if needed
      setInvalidDialogOpen(false);
      setInvalidReason("");
    } finally {
      setVerificationLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)",
        py: 12,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: "1536px", mx: "auto" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              textAlign: "center",
              mb: 2,
              background: "linear-gradient(90deg, #16a34a 0%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "2.5rem" },
            }}
          >
            Ayurvedic AI Search
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontSize: "1.125rem",
            }}
          >
            Ask any health-related question and get personalized Ayurvedic
            insights
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: "3rem" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              id="ai-search-input"
              inputRef={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about symptoms, remedies, routines..."
              onKeyDown={handleKeyDown}
              autoFocus
              inputProps={{ autoComplete: "off", readOnly: false }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "56px",
                  fontSize: "1.125rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  "& fieldset": {
                    borderWidth: "2px",
                    borderColor: "grey.300",
                  },
                  "&:hover fieldset": {
                    borderColor: "grey.400",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "success.main",
                  },
                },
              }}
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                variant="contained"
                sx={{
                  height: "56px",
                  px: 4,
                  fontSize: "1.125rem",
                  background:
                    "linear-gradient(90deg, #16a34a 0%, #2563eb 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #15803d 0%, #1e40af 100%)",
                  },
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SearchIcon />
                  )
                }
              >
                Search
              </Button>
              <VoiceToText
                onTranscriptChange={handleTranscriptChange}
                disabled={isLoading}
              />
            </Box>
          </Box>
        </motion.div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
            >
              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  General Posts
                </Typography>
                <Box sx={{ display: "grid", gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <GeneralPostCardSkeleton key={i} />
                  ))}
                </Box>
              </div>

              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  Routines
                </Typography>
                <Box sx={{ display: "grid", gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <RoutinePostCardSkeleton key={i} />
                  ))}
                </Box>
              </div>

              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  Success Stories
                </Typography>
                <Box sx={{ display: "grid", gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <SuccessStoryCardSkeleton key={i} />
                  ))}
                </Box>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {results && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
          >
            {/* General Posts */}
            {results.generalPosts.length > 0 && (
              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  Recommended Posts
                </Typography>
                <Box sx={{ display: "grid", gap: 3 }}>
                  {results.generalPosts.map((post) => (
                    <Box key={post._id} sx={{ maxWidth: 700, mx: "auto", width: "100%" }}>
                      <GeneralPostCard
                        post={post}
                        isLiked={Math.random() < 0.5}
                        isSaved={Math.random() < 0.5}
                        currentUserId={userId}
                        onMediaClick={openMediaViewer}
                        onDelete={() => { }}
                        onEdit={() => { }}
                      />
                    </Box>
                  ))}
                </Box>
              </div>
            )}

            {/* Routines */}
            {results.routines.length > 0 && (
              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  Suggested Routines
                </Typography>
                <Box sx={{ display: "grid", gap: 3 }}>
                  {results.routines.map((routine) => (
                    <Box key={routine._id} sx={{ maxWidth: 700, mx: "auto", width: "100%" }}>
                      <RoutinePostCard
                        post={routine}
                        isLiked={Math.random() < 0.5}
                        isSaved={Math.random() < 0.5}
                        currentUserId={userId}
                        onMediaClick={openMediaViewer}
                        onDelete={() => { }}
                        onEdit={() => { }}
                      />
                    </Box>
                  ))}
                </Box>
              </div>
            )}

            {/* Success Stories */}
            {results.successStories.length > 0 && (
              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  Inspiring Stories
                </Typography>
                <Box sx={{ display: "grid", gap: 3 }}>
                  {results.successStories.map((story, index) => (
                    <Box key={story._id || index} sx={{ maxWidth: 700, mx: "auto", width: "100%" }}>
                      <SuccessStoryPostCard
                        post={story}
                        isLiked={Math.random() < 0.5}
                        isSaved={Math.random() < 0.5}
                        addVerifiedExpert={addVerifiedExpert}
                        currentUserId={userId}
                        onMediaClick={openMediaViewer}
                        menuItems={[]}
                        handleVerifiersDialogOpen={handleVerifiersDialogOpen}
                        handleInvalidDialogOpen={handleInvalidDialogOpen}
                        verificationLoading={verificationLoading}
                        setVerificationLoading={setVerificationLoading}
                      />
                    </Box>
                  ))}
                </Box>
              </div>
            )}

            {/* Fallback - only if all categories are empty */}
            {results.generalPosts.length === 0 &&
              results.routines.length === 0 &&
              results.successStories.length === 0 && (
                <NoPostFound
                  message="No posts found. Try adjusting your search or filters to find what you're looking for."
                  onReset={handleSearchReset}
                  mt={4}
                />

              )}
          </motion.div>
        )}

      </Box>
      {/* Media Viewer Dialog */}
      <MediaViewerDialog
        open={openMediaDialog}
        images={mediaDialogImages}
        title={""}
        selectedImageIndex={selectedMediaImageIndex || 0}
        onClose={closeMediaViewer}
        // onNext={handleNextImage}
        // onPrev={handlePrevImage}
      />

      {/* Verifiers Dialog at top level for AI search */}
      <VerifiersDialog
        open={verifiersDialogOpen}
        onClose={() => {
          setVerifiersDialogOpen(false);
          setVerifiersDialogData([]);
        }}
        verifiers={verifiersDialogData}
        postTitle={verifiersDialogPostTitle}
      />
      {/* Invalid Dialog at top level for AI search */}
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

export default AISearchPage;
