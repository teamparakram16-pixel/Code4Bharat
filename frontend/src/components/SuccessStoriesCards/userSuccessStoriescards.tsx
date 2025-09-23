import SuccessStoryPostCard from "@/components/PostCards/SuccessStoryPostCard/SuccessStoryPostCard";
import { SuccessStoryType } from "@/types/SuccessStory.types";

interface UserSuccessStoryCardProps {
  story: SuccessStoryType;
  [key: string]: any;
}

const UserSuccessStoryCard = ({
  story,
  ...rest
}: UserSuccessStoryCardProps) => {
  // Defensive fallback for all required fields
  const safeStory = {
    ...story,
    likesCount: typeof story.likesCount === "number" ? story.likesCount : 0,
    commentsCount:
      typeof story.commentsCount === "number" ? story.commentsCount : 0,
    owner: story.owner ?? {
      profile: { fullName: "Unknown", profileImage: "" },
      _id: "",
    },
    media: story.media ?? { images: [], video: null, document: null },
    readTime: story.readTime ?? "",
    createdAt: story.createdAt ?? new Date().toISOString(),
    tagged: Array.isArray(story.tagged)
      ? story.tagged.map((tag) =>
          typeof tag === "object" && tag !== null && "profile" in tag
            ? tag
            : {
                profile: { fullName: String(tag), profileImage: "" },
                _id: String(tag),
              }
        )
      : [],
    filters: Array.isArray(story.filters) ? story.filters : [],
    routines: Array.isArray(story.routines) ? story.routines : [],
    verified: Array.isArray(story.verified) ? story.verified : [],
    rejections: Array.isArray(story.rejections) ? story.rejections : [],
    verifyAuthorization:
      typeof story.verifyAuthorization === "boolean"
        ? story.verifyAuthorization
        : false,
    alreadyVerified:
      typeof story.alreadyVerified === "boolean"
        ? story.alreadyVerified
        : false,
    alreadyRejected:
      typeof story.alreadyRejected === "boolean"
        ? story.alreadyRejected
        : false,
    invalid: story.invalid ?? undefined,
  };

  // Provide robust defaults for required props
  const defaultProps = {
    isLiked: false,
    isSaved: false,
    currentUserId: safeStory.owner?._id ?? "",
    addVerifiedExpert: () => {},
    onMediaClick: () => {},
    menuItems: [],
    handleVerifiersDialogOpen: () => {},
    handleInvalidDialogOpen: () => {},
    verificationLoading: false,
  };

  return <SuccessStoryPostCard post={safeStory} {...defaultProps} {...rest} />;
};

export default UserSuccessStoryCard;
