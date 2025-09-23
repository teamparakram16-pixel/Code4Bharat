import { UserOrExpertDetailsType } from "@/types";
import { ChatUsers } from "@/types/ChatUsers.types";

export interface UserInfoProps {
  users: ChatUsers[];
  groupName?: string;
  owner: UserOrExpertDetailsType | null;
}
