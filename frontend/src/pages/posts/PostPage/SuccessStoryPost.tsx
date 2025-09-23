import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SuccessStoryCardSkeleton } from "@/components/PostCards/PostCardSkeletons";
import useSuccessStory from "@/hooks/useSuccessStory/useSuccessStory";
import SuccessStoryPostCard from "@/components/PostCards/SuccessStoryPostCard/SuccessStoryPostCard";
import { SuccessStoryType } from "@/types/SuccessStory.types";
import { useAuth } from "@/context/AuthContext";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";
import { Delete, Edit } from "@mui/icons-material";
import { UserOrExpertDetailsType } from "@/types";
import {
  VerifiersDialog,
  InvalidDialog,
} from "@/components/PostCards/SuccessStoryPostCard/Sections/VerificationDialogs";

export function SuccessStoryPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getSuccessStoryById ,deleteSuccessStory } = useSuccessStory();
  const { setIsLoggedIn, setRole } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<SuccessStoryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<
    number | null
  >(null);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);

  const [_openEditDialog, setOpenEditDialog] = useState(false);
  const [_currentPost, setCurrentPost] = useState<SuccessStoryType | null>(
    null
  );

  const [userId, setUserId] = useState<string>("");

  // Dialog state for single post view
  const [verifiersDialogOpen, setVerifiersDialogOpen] = useState(false);
  const [verifiersDialogData, setVerifiersDialogData] = useState<any[]>([]);
  const [verifiersDialogPostTitle, setVerifiersDialogPostTitle] = useState("");
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        const ssData = await getSuccessStoryById(id);

        setIsLoggedIn(true);
        setRole(ssData.userRole);
        setPost(ssData.successStory);
        setUserId(ssData.userId);
        setLoading(false);
      } catch (error: any) {
        console.log("Error : ", error);
        if (error.status === 400)
          navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
      }
    };

    fetchPost();
  }, [id]);

  const handleEdit = (post: SuccessStoryType) => {
    setCurrentPost(post);
    setOpenEditDialog(true);
  };

  const handleDelete = async (_postId: string) => {
  try {
    await deleteSuccessStory(_postId);
    navigate("/success-stories");
  } catch (error) {
    console.error("Failed to delete the story", error);
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
    _postId: string,
    expert: UserOrExpertDetailsType
  ) => {
    setPost((prev) => {
      if (!prev) return prev;
      // Ensure the verified array is always of the correct type
      return {
        ...prev,
        verified: [
          ...prev.verified,
          { expert, date: new Date().toISOString() },
        ],
        verifyAuthorization: false,
        alreadyVerified: true,
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
    if (!post) return;
    if (!invalidReason.trim()) return;
    setVerificationLoading(true);
    try {
      // You may want to call verifySuccessStory here if needed
      // const response = await verifySuccessStory(post._id, "reject", invalidReason);
      // if (response?.success) { ... }
      setInvalidDialogOpen(false);
      setInvalidReason("");
    } finally {
      setVerificationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen w-full bg-gray-50">
        <div className="w-full w-screen max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <SuccessStoryCardSkeleton />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center w-screen justify-center min-h-screen w-full bg-gray-50">
        Post not found
      </div>
    );
  }

  return (
    <div className="w-screen w-full bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-green-50">
            <Link to="/success-stories" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all stories
            </Link>
          </Button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <SuccessStoryPostCard
            key={post._id}
            post={post}
            isLiked={Math.floor(Math.random() * 2) === 1 ? true : false}
            isSaved={Math.floor(Math.random() * 2) === 1 ? true : false}
            currentUserId={userId}
            addVerifiedExpert={addVerifiedExpert}
            onMediaClick={openMediaViewer}
            handleVerifiersDialogOpen={handleVerifiersDialogOpen}
            handleInvalidDialogOpen={handleInvalidDialogOpen}
            setVerificationLoading={setVerificationLoading}
            verificationLoading={verificationLoading}
            menuItems={[
              ...(isPostAuthor(post)
                ? [
                    {
                      label: "Edit",
                      icon: <Edit fontSize="small" />,
                      action: () => handleEdit(post),
                    },
                    {
                      label: "Delete",
                      icon: <Delete fontSize="small" />,
                      action: () => handleDelete(post._id),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>

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

      {/* Verifiers Dialog at top level for single post view */}
      <VerifiersDialog
        open={verifiersDialogOpen}
        onClose={() => {
          setVerifiersDialogOpen(false);
          setVerifiersDialogData([]);
        }}
        verifiers={verifiersDialogData}
        postTitle={verifiersDialogPostTitle}
      />
      {/* Invalid Dialog at top level for single post view */}
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
    </div>
  );
}
