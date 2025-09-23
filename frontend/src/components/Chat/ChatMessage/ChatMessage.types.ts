import { ChatUsers } from "@/types/ChatUsers.types";
import { Message } from "@/types/Message.types";

export interface ChatMessageProps {
  message: Message;
  currUser: ChatUsers | null;
  isHighlighted?: boolean;
  isCurrentSearch?: boolean;
  searchQuery?: string;
}
