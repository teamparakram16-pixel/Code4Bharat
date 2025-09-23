import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import { RoutineSchema } from "./useRoutine.types";

const useRoutines = () => {
  const { get, post, del,put } = useApi();


  const getRoutinesPostById = async (id: string) => {
    try {
      const rposts = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/routines/${id}`
      );

      return rposts;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const getAllRoutinesPost = async () => {
    try {
      const rposts = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/routines`
      );

      return rposts;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const submitRoutinePost = async (formData: RoutineSchema) => {
    try {
      const routineData = new FormData();
      routineData.append("title", formData.title);
      routineData.append("description", formData.description);
      if (formData.thumbnail instanceof File) {
        routineData.append("thumbnail", formData.thumbnail);
      }
      routineData.append("routines", JSON.stringify(formData.routines));

    
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/routines`,
        routineData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Routine post created successfully");
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const filterSearch = async (query: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/routines/filter`,
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
const updateRoutinePost = async (
    id: string,
    payload: { title: string; description: string; routines: any[] }
  ) => {
    try {
      const res = await put(
        `${import.meta.env.VITE_SERVER_URL}/api/routines/${id}`,
        payload
      );
      toast.success("Routine updated successfully");
      return res;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      const res = await del(`${import.meta.env.VITE_SERVER_URL}/api/routines/${id}`);
      toast.success("Routine deleted successfully");
      return res;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };



  return {
    getRoutinesPostById,
    getAllRoutinesPost,
    submitRoutinePost,
    filterSearch,
    deleteRoutine,
    updateRoutinePost,
  };
};

export default useRoutines;
