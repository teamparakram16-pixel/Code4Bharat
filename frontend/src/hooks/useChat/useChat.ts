import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { ChatParticipants, ChatRequestData } from "./useChat.types";

const 
useChat = () => {
  const { get, post } = useApi();

  const fetchChatMessages = async (chatId: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/chat/${chatId}`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const createChat = async (participants: ChatParticipants[]) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/chat`,
        { participants }
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const sendChatRequest = async (data: ChatRequestData) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/chat/request`,
        data
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const acceptChatRequest = async (chatRequestId: string) => {
    try {
      const response = await post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/chat/request/${chatRequestId}/accept`,
        {}
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const rejectChatRequest = async (chatRequestId: string) => {
    try {
      const response = await post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/chat/request/${chatRequestId}/reject`,
        {}
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  // Fetch received chat requests, optionally filtered by type
  const getReceivedChatRequests = async (type?: "private" | "group") => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/chat/received-requests`,
        { params: { type } }
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  // Fetch sent chat requests, optionally filtered by type
  const getSentChatRequests = async (type?: "private" | "group") => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/chat/sent-requests`,
        { params: { type } }
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  // Fetch all chats for the current user
  const getMyChats = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/chat/my-chats`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  return {
    fetchChatMessages,
    createChat,
    sendChatRequest,
    acceptChatRequest,
    rejectChatRequest,
    getSentChatRequests,
    getReceivedChatRequests,
    getMyChats,
  };
};

export default useChat;
