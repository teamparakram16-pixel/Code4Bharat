import { RefObject } from "react";
import { Comment } from "@/types/Comment.types";

export interface CommentSectionProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  currentUserId: string;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  postId: string;
  postType: "Post" | "SuccessStory" | "Routine";
}
