import { RoutinePostType } from "@/types/RoutinesPost.types";

export interface RoutinePostCardProps {
  post: RoutinePostType;
  isLiked: boolean;
  isSaved: boolean;
  currentUserId: string;
  onMediaClick: (mediaIndex: number, images: string[]) => void;
  // menuItems: Array<{
  //   label: string;
  //   icon: React.ReactNode;
  //   action: () => void;
  // }>;
  onEdit: any; //() => (postId: string) => void | undefined;
  onDelete: any; //() => (postId: string) => void | undefined;
}
