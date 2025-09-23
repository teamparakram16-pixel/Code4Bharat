import useApi from "@/hooks/useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import {
  FetchCommentsOptions,
  CreateCommentOptions,
  EditCommentOptions,
  DeleteCommentOptions,
} from "./useComment.types";

const ENDPOINTS = {
  Post: "posts",
  SuccessStory: "success-stories",
  Routine: "routines",
};

const useComment = () => {
  const { get, post, put, del } = useApi();

  // Fetch top-level comments or replies
  const fetchComments = async ({
    postType,
    postId,
    parentCommentId,
  }: FetchCommentsOptions) => {
    try {
      let url = `${import.meta.env.VITE_SERVER_URL}/api/${
        ENDPOINTS[postType]
      }/${postId}/comments`;
      if (parentCommentId) url += `?commentId=${parentCommentId}`;
      const response = await get(url);
      return response;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  // Create a comment or reply
  const createComment = async ({
    postType,
    postId,
    payload,
  }: CreateCommentOptions) => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/${
        ENDPOINTS[postType]
      }/${postId}/comments`;
      const response = await post(url, payload);
      return response;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  // Edit a comment
  const editComment = async ({
    postType,
    commentId,
    content,
  }: EditCommentOptions) => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/${
        ENDPOINTS[postType]
      }/comments/${commentId}`;
      const response = await put(url, { content });
      return response;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  // Delete a comment
  const deleteComment = async ({
    postType,
    commentId,
  }: DeleteCommentOptions) => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/${
        ENDPOINTS[postType]
      }/comments/${commentId}`;
      const response = await del(url);
      return response;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  return {
    fetchComments,
    createComment,
    editComment,
    deleteComment,
  };
};


export default useComment;
