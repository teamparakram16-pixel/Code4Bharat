import { useState, useEffect } from "react";
import axios from "axios";

import { SuccessStoryType } from "@/types/SuccessStory.types";

interface ApiResponse {
  success: boolean;
  message: string;
  successStories: SuccessStoryType[];
  userId: string;
}

export const useUserSuccessStories = () => {
  const [stories, setStories] = useState<SuccessStoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_SERVER_URL}/api/success-stories/allposts`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setStories(res.data.successStories);
        } else {
          setError("Failed to load stories: " + res.data.message);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return { stories, loading, error };
};

// export interface SuccessStory {
//   _id: string;
//   title: string;
//   description: string;
//   filters: string[];
//   tagged: string[];
//   routines: string[];
//   readTime: string;
//   likesCount: number;
//   commentsCount: number;
//   owner: {
//     profile: {
//       fullName: string;
//       profileImage: string;
//     };
//     _id: string;
//   };
//   verified: any[];
//   rejections: any[];
//   createdAt: string;
//   updatedAt: string;
//   media: {
//     images: string[];
//     video: string | null;
//     document: string | null;
//   };
// }
