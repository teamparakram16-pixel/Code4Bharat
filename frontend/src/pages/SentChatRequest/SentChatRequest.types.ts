import { ReceivedChatRequest } from "../ReceivedChatRequest/ReceivedChatRequest.types";

export interface SentChatRequestState {
  searchTerm: string;
  activeTab: number;
  requests: ReceivedChatRequest[];
  loading: boolean;
  groupDialogOpen: boolean;
  groupDialogRequest: ReceivedChatRequest | null;
}
