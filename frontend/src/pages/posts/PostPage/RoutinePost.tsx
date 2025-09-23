import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RoutinePostCardSkeleton } from "@/components/PostCards/PostCardSkeletons";
import useRoutines from "@/hooks/useRoutine/useRoutine";
import RoutinePostCard from "@/components/PostCards/RoutinePostCard/RoutinePostCard";
import { RoutinePostType } from "@/types/RoutinesPost.types";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";
// import { Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
export function RoutinePost() {
  const { getRoutinesPostById,deleteRoutine } = useRoutines();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<RoutinePostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<
    number | null
  >(null);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);

  const [_openEditDialog, setOpenEditDialog] = useState(false);
  const [_currentPost, setCurrentPost] = useState<RoutinePostType | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        const routine = await getRoutinesPostById(id);

        setUserId(routine.userId);

        setPost(routine.routine);
        setLoading(false);
      } catch (error: any) {
        console.log("Error : ", error);
        if (error.status === 400)
          navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
      }
    };

    fetchPost();
  }, [id]);

  const handleEdit = (post: RoutinePostType) => {
    setCurrentPost(post);
    setOpenEditDialog(true);
  };

  const handleDelete = async (id: string) => {
  try {
    await deleteRoutine(id);
    toast.success("Routine deleted successfully");
    navigate("/routines"); // go back to routines list or home
  } catch (err) {
    toast.error("Failed to delete routine");
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

  // const isPostAuthor = (post: RoutinePostType) => {
  //   return post.owner._id === userId;
  // };

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

  if (loading) {
    return (
      <div className="flex items-center w-screen justify-center min-h-screen w-full bg-gray-50">
        <div className="w-full w-screen max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <RoutinePostCardSkeleton />
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
            <Link to="/routines" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all routines
            </Link>
          </Button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <RoutinePostCard
            key={post._id}
            post={post}
            isLiked={Math.floor(Math.random() * 2) === 1 ? true : false}
            isSaved={Math.floor(Math.random() * 2) === 1 ? true : false}
            currentUserId={userId}
            onMediaClick={openMediaViewer}
            // menuItems={[
            //   ...(isPostAuthor(post)
            //     ? [
            //         {
            //           label: "Edit",
            //           icon: <Edit fontSize="small" />,
            //           action: () => handleEdit(post),
            //         },
            //         {
            //           label: "Delete",
            //           icon: <Delete fontSize="small" />,
            //           action: () => handleDelete(post._id),
            //         },
            //       ]
            //     : []),
            // ]}
            onEdit={() => handleEdit(post)}
            onDelete={() => handleDelete(post._id)}
          />
        </div>
      </div>
      <MediaViewerDialog
        open={openMediaDialog}
        images={mediaDialogImages}
        title={""}
        selectedImageIndex={selectedMediaImageIndex || 0}
        onClose={closeMediaViewer}
        // onNext={handleNextImage}
        // onPrev={handlePrevImage}
      />
    </div>
  );
}
