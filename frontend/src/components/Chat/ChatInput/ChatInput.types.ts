import { UserOrExpertDetailsType } from "@/types";
import { Socket } from "socket.io-client";

export interface ChatInputProps {
  chatId: string;
  currUser: UserOrExpertDetailsType | null;
  socket: Socket | null;
  sendMessage: (message: string) => void;
}
