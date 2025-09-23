import { useState, useRef, FC, useEffect } from "react";
import { Card, Divider, Collapse } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  SuccessStoryCardProps,
  VerificationDialogDataType,
} from "./SuccessStoryPostCard.types";
import { AuthorSection } from "./Sections/AuthorSection";
import { TaggedDoctors } from "./Sections/TaggedDoctors";
import { PostContent } from "./Sections/PostContent";
import { RoutinesSection } from "./Sections/RoutinesSection";
import { PostActions } from "./Sections/PostActions";
import CommentSection from "../CommentSection/CommentSection";
import { PostMenu } from "./Sections/PostMenu";
import useSuccessStory from "@/hooks/useSuccessStory/useSuccessStory";
import ShareMenu from "@/components/ShareMenu/ShareMenu";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  overflow: "hidden",
  transition: "all 0.3s ease",
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.grey[200]}`,
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-4px)",
  },
}));

const SuccessStoryPostCard: FC<
  SuccessStoryCardProps & {
    handleVerifiersDialogOpen: (
      verifiers: VerificationDialogDataType[],
      postTitle: string
    ) => void;
    handleInvalidDialogOpen: (postId: string) => void;
    setVerificationLoading?: (loading: boolean) => void;
    verificationLoading: boolean;
  }
> = ({
  post,
  isLiked,
  isSaved,
  currentUserId,
  menuItems,
  onMediaClick,
  handleVerifiersDialogOpen,
  handleInvalidDialogOpen,
  setVerificationLoading,
  verificationLoading,
}) => {
  const { verifySuccessStory } = useSuccessStory();

  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [viewCount] = useState(Math.floor(Math.random() * 1000));
  const [verificationStatus, setVerificationStatus] = useState<
    "verified" | "invalid" | "unverified"
  >(
    post.alreadyVerified
      ? "verified"
      : post.alreadyRejected
      ? "invalid"
      : "unverified"
  );
  const [showVerifyActions, setShowVerifyActions] = useState(
    post.verifyAuthorization
  );

  const [successStoryPost, setSuccessStoryPost] = useState(post);

  useEffect(()=>{
    setVerificationStatus(post.alreadyVerified ? "verified" : post.alreadyRejected ? "invalid" : "unverified");
    setShowVerifyActions(post.verifyAuthorization);
    setSuccessStoryPost(post);
  },[post])

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

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const toggleSave = () => {
    setSaved(!saved);
  };

  const handleMarkInvalid = () => {
    if (handleInvalidDialogOpen) handleInvalidDialogOpen(post._id);
  };

  const handleVerify = async () => {
    if (setVerificationLoading) setVerificationLoading(true);
    try {
      const response = await verifySuccessStory(post._id, "accept");
      if (response?.success) {
        setVerificationStatus("verified");
        setShowVerifyActions(false);
        if (handleVerifiersDialogOpen)
          handleVerifiersDialogOpen(
            response.data.successStory.verified,
            post.title
          );
        setSuccessStoryPost((prev) => {
          return {
            ...prev,
            verifyAuthorization: false,
            alreadyVerified: true,
            verified: response.data.successStory.verified,
          };
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      if (setVerificationLoading) setVerificationLoading(false);
    }
  };

  return (
    <StyledCard>
      <AuthorSection
        post={successStoryPost}
        verificationStatus={verificationStatus}
        showVerifyActions={showVerifyActions}
        handleMenuOpen={handleMenuOpen}
        handleMarkInvalid={handleMarkInvalid}
        handleVerify={handleVerify}
        handleVerifiersDialogOpen={handleVerifiersDialogOpen}
        verificationLoading={verificationLoading}
      />

      <TaggedDoctors post={successStoryPost} />

      <PostContent post={successStoryPost} onMediaClick={onMediaClick} />

      <RoutinesSection routines={successStoryPost.routines} />

      <PostActions
        liked={liked}
        likeCount={likeCount}
        commentCount={successStoryPost.commentsCount}
        viewCount={viewCount}
        saved={saved}
        isAuthor={successStoryPost.owner._id === currentUserId}
        toggleLike={toggleLike}
        handleCommentClick={handleCommentClick}
        handleShareClick={handleShareClick}
        toggleSave={toggleSave}
      />

      <Collapse in={commentOpen} timeout="auto" unmountOnExit>
  <Divider />
  <CommentSection
    comments={comments as any}
    setComments={setComments as any}
    currentUserId={currentUserId}
    inputRef={commentInputRef as any}
    postId={post._id}
    postType="SuccessStory"
  />
</Collapse>


      <ShareMenu
        anchorEl={shareAnchorEl}
        open={Boolean(shareAnchorEl)}
        onClose={handleShareClose}
        postTitle={successStoryPost.title}
      />

      <PostMenu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        menuItems={menuItems}
        handleShareClick={handleShareClick}
      />
    </StyledCard>
  );
};

export default SuccessStoryPostCard;
