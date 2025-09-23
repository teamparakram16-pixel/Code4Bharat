import { toast } from "react-toastify";
import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
// Import your types as needed
// import { RoutineAppointmentFormSchema, RoutineResponseFormSchema } from "./useRoutineConsultation.types";

const useRoutineConsultation = () => {
  const { post, patch, get } = useApi();

  // Create routine appointment
  const createRoutineAppointment = async (formData: any) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment/routine`,
        formData
      );
      toast.success("Routine appointment created successfully");
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  // Get routine appointment by ID
  const getRoutineAppointmentById = async (id: string) => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment/routine/${id}`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  // Doctor's response to routine appointment
  const respondToRoutineAppointment = async (
    id: string,
    formData: any // Replace with your response schema
  ) => {
    try {
      const response = await patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/consultation/routine/${id}/response`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // If uploading files
          },
        }
      );
      toast.success("Response submitted successfully");
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  return {
    createRoutineAppointment,
    getRoutineAppointmentById,
    respondToRoutineAppointment,
  };
};

export default useRoutineConsultation;
