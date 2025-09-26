import { useState } from "react";
import { toast } from "react-toastify";
import useApi from "../useApi/useApi";
import { RoutineAppointment } from "./useAppointmentHook.types";
import { handleAxiosError } from "@/utils/handleAxiosError";

interface AppointmentPayload {
  expertId: string;
  appointmentDate: string; // "YYYY-MM-DD"
  appointmentTime: string; // "HH:mm"
  description?: string;
}

export const useAppointmentsHooks = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submit, setSubmit] = useState(false);

  // Create consultation appointment
  const createAppointment = async (payload: AppointmentPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment`,
        payload
      );
      return response.appointment;
    } catch (err: any) {
      handleAxiosError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all consultations for logged-in user
  const getUserAppointments = async (): Promise<{
    appointments: any[];
    routineAppointments: any[];
  }> => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment/consultations/user`
      );
      return data;
    } catch (err: any) {
      handleAxiosError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all consultations for expert
  const getExpertAppointments = async (): Promise<{
    appointments: any[];
    routineAppointments: any[];
  }> => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment/consultations/expert`
      );
      return data;
    } catch (err: any) {
      handleAxiosError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get consultation appointment by meetId
  const getAppointmentByMeetId = async (
    meetId: string
  ): Promise<{ appointment: any; linkExpired: boolean }> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment/consultations/${meetId}`
      );
      return response.data;
    } catch (err: any) {
      handleAxiosError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify meeting link by meetId
  const verifyMeetLink = async (meetId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment/verify/${meetId}`
      );
      return data; // { message: "success" | "expired" }
    } catch (err: any) {
      handleAxiosError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📌 Get Routine Appointment By ID (typed)
  const getRoutineAppointmentById = async (
    id: string
  ): Promise<{ routineAppointment: RoutineAppointment }> => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment/routine/${id}`
      );
      return data.routineAppointment;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch routine appointment"
      );
      toast.error(
        err.response?.data?.message || err.message || "Error fetching routine appointment"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Share routine with PDF and routineResponse data.
   * @param id Routine appointment ID
   * @param pdfBlob PDF file (Blob)
   */
  const shareRoutineAppointment = async (id: string, pdfBlob: Blob) => {
    try {
      setSubmit(true);
      setError(null);

      const formData = new FormData();
      formData.append("routineResponse", pdfBlob, "routine.pdf");

      const response = await api.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment/routine/${id}/response`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err: any) {
      handleAxiosError(err);
    } finally {
      setSubmit(false);
    }
  };

  return {
    loading,
    error,
    setLoading,
    setSubmit,
    submit,
    createAppointment,
    getUserAppointments,
    getExpertAppointments,
    getRoutineAppointmentById,
    shareRoutineAppointment,
    getAppointmentByMeetId,
    verifyMeetLink,
  };
};
