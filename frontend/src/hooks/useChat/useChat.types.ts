export interface ChatParticipants {
  userType: "User" | "Expert";
  user: string;
}

export interface ChatRequestUser {
  user: string; // MongoDB ObjectId as string
  userType: "User" | "Expert";
}

export interface ChatRequestData {
  chatType: "private" | "group";
  groupName?: string;
  users: ChatRequestUser[];
  chatReason: {
    similarPrakrithi: boolean;
    otherReason?: string | null;
  };
}
