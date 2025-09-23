import { ReceivedChatRequest } from "@/pages/ReceivedChatRequest/ReceivedChatRequest.types";

const countPrivateRequests = (
  requests: ReceivedChatRequest[],
  currUser?: string
) =>
  requests.filter(
    (req) =>
      req.chatType === "private" &&
      req.users?.some((u: any) =>
        currUser
          ? u.user._id === currUser && u.status === "pending"
          : u.status === "pending"
      )
  ).length;

export default countPrivateRequests;
