import { toast } from "react-toastify";
import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { PostFormSchema } from "./usePost.types";

const usePost = () => {
  const { post, get, del, put } = useApi();


  const getAllPosts = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const getPostById = async (id: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${id}`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const submitPost = async (formData: PostFormSchema) => {
    try {
      const postData = new FormData();
      postData.append("title", formData.title);
      postData.append("description", formData.description);
      if (formData.media.images.length > 0) {
        formData.media.images.forEach((image) => {
          postData.append("media", image);
        });
      } else if (formData.media.video) {
        postData.append("media", formData.media.video);
      } else if (formData.media.document) {
        postData.append("media", formData.media.document);
      }

      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`,
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Post created successfully");
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const filterSearch = async (query: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/filter`,
        {
          params: {
            filters: query,
          },
        }
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const updatePost = async (postId: string, formData: { title: string; description: string; filters: string[] }) => {
    try {
      const response = await put(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${postId}`,
        formData
      );
      toast.success("Post updated successfully");
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };



  const deleteGeneralPost = async (postId: string) => {
    try {
      await del(`${import.meta.env.VITE_SERVER_URL}/api/posts/${postId}`);
      toast.success("Post deleted successfully");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete post");
    }
  };

  return {
    submitPost,
    getAllPosts,
    getPostById,
    filterSearch,
    deleteGeneralPost,
    updatePost,
  };

};

export default usePost;
