import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";

const useAiSearch = () => {
  const { get } = useApi();

  const searchWithAi = async (query: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/ai/search`,
        {
          params: { prompt: query },
        }
      );

      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };


  return {
    searchWithAi,
  };
};

export default useAiSearch;
