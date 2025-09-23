import { UserOrExpertDetailsType } from "@/types";
import { SuccessStoryType } from "@/types/SuccessStory.types";

export interface SuccessStoryCardProps {
  post: SuccessStoryType;
  isLiked: boolean;
  isSaved: boolean;
  currentUserId: string;
  addVerifiedExpert: (postId: string, expert: UserOrExpertDetailsType) => void;
  onMediaClick: (mediaIndex: number, images: string[]) => void;
  menuItems: Array<{
    label: string;
    icon: React.ReactNode;
    action: () => void;
  }>;
}

export interface VerificationDialogDataType {
  expert: UserOrExpertDetailsType;
  date: Date | string;
  reason?: string;
}
