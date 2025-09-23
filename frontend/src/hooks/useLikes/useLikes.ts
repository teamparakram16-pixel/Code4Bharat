import { useEffect, useState } from "react";
import axios from "axios";

export const useLikes = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isLiking, setIsLiking] = useState(false);
  const [likeError, setLikeError] = useState(null);

  const fetchLikedPosts = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/liked-posts`, {
        withCredentials: true,
      });
      setLikedPosts(res.data.likedPosts ?? []);
    } catch (err) {
      console.error("fetchLikedPosts error:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const likePost = async (postId: string) => {
    setIsLiking(true);
    setLikeError(null);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/liked-posts/${postId}`,
        {},
        { withCredentials: true }
      );
      await fetchLikedPosts(); // Refresh the liked posts list
    } catch (err: any) {
      setLikeError(err);
    } finally {
      setIsLiking(false);
    }
  };

  const unlikePost = async (postId: string) => {
    setIsLiking(true);
    setLikeError(null);
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/users/liked-posts/${postId}`,
        { withCredentials: true }
      );
      await fetchLikedPosts(); // Refresh the liked posts list
    } catch (err: any) {
      setLikeError(err);
    } finally {
      setIsLiking(false);
    }
  };

  const isLiked = (postId: string) => {
    return likedPosts.some((post: any) => post._id === postId);
  };

  useEffect(() => {
    fetchLikedPosts();
  }, []);

  return {
    likedPosts,
    isLoading,
    isError,
    refetch: fetchLikedPosts,
    likePost,
    unlikePost,
    isLiked,
    isLiking,
    likeError,
  };
};
