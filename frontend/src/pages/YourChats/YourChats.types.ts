import { ChatUsers } from "@/types/ChatUsers.types";
import { Message } from "@/types/Message.types";
import { ReceivedChatRequest } from "../ReceivedChatRequest/ReceivedChatRequest.types";

export interface IParticipant {
  user: ChatUsers;
}

export interface IChat {
  _id: string;
  latestMessage: Message | null;
  participants: IParticipant[];
  chatRequest: ReceivedChatRequest;
  groupChat: boolean;
  groupChatName: string;
  updatedAt: string;
  owner: ChatUsers;
}
