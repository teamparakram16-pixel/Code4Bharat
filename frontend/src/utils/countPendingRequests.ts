import { ReceivedChatRequest } from "@/pages/ReceivedChatRequest/ReceivedChatRequest.types";

// Helper functions to count requests
const countPendingRequests = (
  requests: ReceivedChatRequest[],
  currUser?: string
) =>
  requests.filter((req) =>
    req.users?.some(
      (u: any) =>
        (u.user._id === currUser && u.status === "pending") ||
        u.status === "pending"
    )
  ).length;

export default countPendingRequests;
