import { ReceivedChatRequest } from "@/pages/ReceivedChatRequest/ReceivedChatRequest.types";

const countGroupRequests = (
  requests: ReceivedChatRequest[],
  currUser?: string
) =>
  requests.filter(
    (req) =>
      req.chatType === "group" &&
      req.users?.some((u: any) =>
        currUser
          ? u.user._id === currUser && u.status === "pending"
          : u.status === "pending"
      )
  ).length;

export default countGroupRequests;
