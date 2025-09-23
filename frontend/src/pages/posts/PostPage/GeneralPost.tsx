import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { GeneralPostCardSkeleton } from "@/components/PostCards/PostCardSkeletons";
import GeneralPostCard from "@/components/PostCards/GeneralPostCard/GeneralPostCard";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";

import usePost from "@/hooks/usePost/usePost";
import { GeneralPostType } from "@/types/GeneralPost.types";

export function GeneralPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPostById, deleteGeneralPost } = usePost();

  const [post, setPost] = useState<GeneralPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;

        const ssData = await getPostById(id);
        console.log("Fetched post response:", ssData);

      if (ssData?.post) {
  setPost(ssData.post);
  setUserId(ssData.userId || "");
} else {
  setPost(null);
}

      } catch (error: any) {
        console.error("Error fetching post:", error);
        if (error?.status === 400) {
          navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const isPostAuthor = () => {
    return post?.owner?._id === userId;
  };

  const handleDelete = async (postId: string) => {
    await deleteGeneralPost(postId);
    navigate("/gposts");
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

  if (loading) {
    return (
      <div className="flex items-center w-screen justify-center min-h-screen bg-gray-50">
        <div className="w-screen max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <GeneralPostCardSkeleton />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        Post not found
      </div>
    );
  }

  return (
    <div className="w-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-green-50">
            <Link to="/gposts" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </Button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <GeneralPostCard
            key={post._id}
            post={post}
            isLiked={false}
            isSaved={false}
            currentUserId={userId}
            onMediaClick={openMediaViewer}
            onEdit={() => console.log("Edit post:", post)}
            onDelete={isPostAuthor() ? () => handleDelete(post._id) : undefined}
          />
        </div>
      </div>

      <MediaViewerDialog
        open={openMediaDialog}
        images={mediaDialogImages}
        title=""
        selectedImageIndex={selectedMediaImageIndex || 0}
        onClose={closeMediaViewer}
      />
    </div>
  );
}

export default GeneralPost;
