import { IChat } from "@/pages/YourChats/YourChats.types";

export interface GroupChatCardProps {
  chat: IChat;
  isMobile: boolean;
  onViewMembers: (chatRequest: any) => void;
}


