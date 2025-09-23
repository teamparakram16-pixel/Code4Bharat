import { ReceivedChatRequest } from "@/pages/ReceivedChatRequest/ReceivedChatRequest.types";


export interface ReceivedChatRequestCardProps {
  request: ReceivedChatRequest;
  myStatus: "pending" | "accepted" | "rejected";
  formatTimestamp: (timestamp: string | Date) => string;
  handleAccept: (id: string) => Promise<{ chat?: string }>;
  handleReject: (id: string) => Promise<{ rejected: boolean }>;
  handleProfileClick: (userId: string) => void;
  setGroupDialogOpen: (open: boolean, request?: ReceivedChatRequest) => void;
}
