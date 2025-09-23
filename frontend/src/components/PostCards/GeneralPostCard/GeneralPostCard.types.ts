import { GeneralPostType } from "@/types/GeneralPost.types";

export interface GeneralPostCardProps {
  post: GeneralPostType;
  isLiked: boolean;
  isSaved: boolean;
  currentUserId: string;
  onMediaClick: (mediaIndex: number, images: string[]) => void;
  // menuItems: Array<{
  //   label: string;
  //   icon: React.ReactNode;
  //   action: () => void;
  // }>;
  onEdit:any;
  onDelete:any;
  onBookmark?:()=>void;
  isBookmarking?:boolean;
}
