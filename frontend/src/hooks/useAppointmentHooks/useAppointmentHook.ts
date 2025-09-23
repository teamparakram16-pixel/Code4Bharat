import { useState } from "react";
import { toast } from "react-toastify";
import useApi from "../useApi/useApi";

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

const createAppointment = async (payload: AppointmentPayload) => {
  try {
    setLoading(true);
    setError(null);

    const response = await api.post(`${import.meta.env.VITE_SERVER_URL}/api/appointment`, payload);
    toast.success("Appointment booked successfully!");
    return response.data.appointment; 
  } catch (err: any) {
    setError(err.response?.data?.message || err.message || "Failed to book appointment");
    toast.error(err.response?.data?.message || err.message || "Error booking appointment");
    throw err;
  } finally {
    setLoading(false);
  }
};


  // 📌 Get User’s Appointments
  const getUserAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get(`${import.meta.env.VITE_SERVER_URL}/api/api/appointment/consultations/user`);
      return data.appointments;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch appointments");
      toast.error(err.response?.data?.message || err.message || "Error fetching appointments");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📌 Get Expert’s Appointments
  const getExpertAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get("/api/appointment/consultations/expert");
      return data.appointments;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch appointments");
      toast.error(err.response?.data?.message || err.message || "Error fetching appointments");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createAppointment,
    getUserAppointments,
    getExpertAppointments,
  };
};
