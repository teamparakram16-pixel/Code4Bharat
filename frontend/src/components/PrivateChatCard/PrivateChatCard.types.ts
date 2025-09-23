import { IChat } from "@/pages/YourChats/YourChats.types";

export interface PrivateChatCardProps {
  chat: IChat;
  currUser: string;
  isMobile: boolean;
}
