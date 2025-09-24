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
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to book appointment"
      );
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Error booking appointment"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📌 Get User’s Appointments
  const getUserAppointments: () => Promise<{
    appointments: any[];
    routineAppointments: any[];
  }> = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment/consultations/user`
      );

      console.log("User Appointments Data:", data); // Debug log

      return data;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch appointments"
      );
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Error fetching appointments"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📌 Get Expert’s Appointments
  const getExpertAppointments: () => Promise<{
    appointments: any[];
    routineAppointments: any[];
  }> = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.get(
        `${import.meta.env.VITE_SERVER_URL
        }/api/appointment/consultations/expert`
      );
      console.log("Expert Appointments Data:", data); // Debug log
      return data;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch appointments"
      );
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Error fetching appointments"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // 📌 Get Appointment by Meet ID
  const getAppointmentByMeetId = async (meetId: string): Promise<{ appointment: any; linkExpired: boolean }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`${import.meta.env.VITE_SERVER_URL}/api/appointment/consultation/${meetId}`);
      return response.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch appointment by Meet ID"
      );
      toast.error(
        err.response?.data?.message || err.message || "Error fetching appointment by Meet ID"
      );
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
      console.log("Fetched Routine Appointment:", data);
      return data.routineAppointment;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch routine appointment"
      );
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error fetching routine appointment"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📌 Get Consultation Appointment By ID
  const getConsultationAppointmentById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/api/appointment/consultation/${id}`
      );
      return data;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch consultation appointment"
      );
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error fetching consultation appointment"
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
   * @param routineResponse Object containing sharedRoutine, doctorNotes, updatedAt, status
   */
  const shareRoutineAppointment = async (id: string, pdfBlob: Blob) => {
    try {
      setSubmit(true);
      setError(null);

      const formData = new FormData();
      formData.append("routineResponse", pdfBlob, "routine.pdf");

      const response = await api.patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/appointment/routine/${id}/response`,
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
    getConsultationAppointmentById,
    shareRoutineAppointment,
    getAppointmentByMeetId
  };
};
