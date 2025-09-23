import { UserOrExpertDetailsType } from "@/types";
import { ChatUsers } from "@/types/ChatUsers.types";

export interface ChatHeaderProps {
  users: ChatUsers[];
  groupName: string;
  owner: UserOrExpertDetailsType | null;
}
