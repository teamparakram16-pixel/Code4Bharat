import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import { SuccessStorySchema } from "./useSuccessStory.types";

const useSuccessStory = () => {
  const { get, post, put,del } = useApi();

  const submitSuccessStory = async (formData: SuccessStorySchema) => {
    try {
      const postData = new FormData();
      postData.append("title", formData.title);
      postData.append("description", formData.description);
      postData.append("routines", JSON.stringify(formData.routines));
      if (formData.media.images.length > 0) {
        formData.media.images.forEach((image) => {
          postData.append("media", image);
        });
      } else if (formData.media.video) {
        postData.append("media", formData.media.video);
      } else if (formData.media.document) {
        postData.append("media", formData.media.document);
      }
      postData.append("tagged", JSON.stringify(formData.tagged));

      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories`,
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Success story shared successfully!");
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const verifySuccessStory = async (
    id: string,
    action: string,
    reason?: string
  ) => {
    if (action !== "accept" && action !== "reject") {
      toast.error("Invalid action specified");
      return;
    }
    try {
      const response = await put(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories/${id}/verify`,
        { action, reason: reason || "" }
      );

      if (response.success) {
        toast.success("Post Verified");
      } else {
        toast.error(
          response.data.message || "Something went wrong while verifying"
        );
      }
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const getAllSuccessStories = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const getSuccessStoryById = async (id: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories/${id}`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const filterSearch = async (query: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories/filter`,
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
  const deleteSuccessStory = async (id: string) => {
  try {
    const response = await del(
      `${import.meta.env.VITE_SERVER_URL}/api/success-stories/${id}`
    );
    toast.success("Post deleted successfully!");
    return response;
  } catch (error: any) {
    handleAxiosError(error);
  }
};

const updateSuccessStory = async (
  id: string,
  data: { title: string; description: string; routines: { time: string; content: string }[] }
) => {
  try {
    const response = await put(
      `${import.meta.env.VITE_SERVER_URL}/api/success-stories/${id}`,
      data
    );
    toast.success("Success story updated successfully!");
    return response;
  } catch (error: any) {
    handleAxiosError(error);
  }
};

const getSuccessStoryDetails = async (id: string) => {
  try {
    const response = await get(
      `${import.meta.env.VITE_SERVER_URL}/api/success-stories/${id}`
    );
    return response;
  } catch (error: any) {
    handleAxiosError(error);
  }
};


 return {
  submitSuccessStory,
  verifySuccessStory,
  getAllSuccessStories,
  getSuccessStoryById,
  getSuccessStoryDetails,
  updateSuccessStory,
  filterSearch,
  deleteSuccessStory,
};
};

export default useSuccessStory;
