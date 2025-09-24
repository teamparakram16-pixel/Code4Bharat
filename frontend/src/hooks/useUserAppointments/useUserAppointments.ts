import { useState} from "react";
import useApi from "../useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import {
  ConsultationAppointment,
  RoutineAppointment,
  AppointmentsResponse,
  AppointmentFilters,
} from "@/types/UserAppointments.types";

const useUserAppointments = () => {
  const { get, put } = useApi();
  const [loading, setLoading] = useState(false);
  const [consultations, setConsultations] = useState<ConsultationAppointment[]>(
    []
  );
  const [routineAppointments, setRoutineAppointments] = useState<
    RoutineAppointment[]
  >([]);
  const [filters, setFilters] = useState<AppointmentFilters>({ status: "all" });

  // Fetch all user appointments
  const fetchUserAppointments = async (filterParams?: AppointmentFilters) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filterParams?.status && filterParams.status !== "all") {
        queryParams.append("status", filterParams.status);
      }
      if (filterParams?.dateRange?.from) {
        queryParams.append("fromDate", filterParams.dateRange.from);
      }
      if (filterParams?.dateRange?.to) {
        queryParams.append("toDate", filterParams.dateRange.to);
      }
      if (filterParams?.doctorId) {
        queryParams.append("doctorId", filterParams.doctorId);
      }

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `${
            import.meta.env.VITE_SERVER_URL
          }/api/appointments/user?${queryString}`
        : `${import.meta.env.VITE_SERVER_URL}/api/appointments/user`;

      const response: AppointmentsResponse = await get(endpoint);

      if (response.success) {
        setConsultations(response.data.consultations);
        setRoutineAppointments(response.data.routines);
      } else {
        toast.error(response.message || "Failed to fetch appointments");
      }
    } catch (error: any) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (
    appointmentId: string,
    appointmentType: "consultation" | "routine"
  ) => {
    try {
      const response = await put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/appointments/${appointmentType}/${appointmentId}/cancel`,
        {}
      );

      if (response.success) {
        toast.success("Appointment cancelled successfully");
        // Refresh appointments
        fetchUserAppointments(filters);
        return true;
      } else {
        toast.error(response.message || "Failed to cancel appointment");
        return false;
      }
    } catch (error: any) {
      handleAxiosError(error);
      return false;
    }
  };

  // Reschedule appointment
  const rescheduleAppointment = async (
    appointmentId: string,
    appointmentType: "consultation" | "routine",
    newDate: string,
    newTime: string
  ) => {
    try {
      const response = await put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/appointments/${appointmentType}/${appointmentId}/reschedule`,
        {
          newDate,
          newTime,
        }
      );

      if (response.success) {
        toast.success("Appointment rescheduled successfully");
        // Refresh appointments
        fetchUserAppointments(filters);
        return true;
      } else {
        toast.error(response.message || "Failed to reschedule appointment");
        return false;
      }
    } catch (error: any) {
      handleAxiosError(error);
      return false;
    }
  };

  // Get appointment by ID
  const getAppointmentById = async (
    appointmentId: string,
    appointmentType: "consultation" | "routine"
  ) => {
    try {
      const response = await get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/appointments/${appointmentType}/${appointmentId}`
      );
      return response;
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  // Apply filters
  const applyFilters = (newFilters: AppointmentFilters) => {
    setFilters(newFilters);
    fetchUserAppointments(newFilters);
  };

  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    const now = new Date();
    const upcoming = [...consultations, ...routineAppointments]
      .filter((appointment) => {
        const appointmentDateTime = new Date(
          `${appointment.appointmentDate} ${appointment.appointmentTime}`
        );
        return appointmentDateTime > now && appointment.status === "scheduled";
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
        const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
        return dateA.getTime() - dateB.getTime();
      });

    return upcoming;
  };

  // Get past appointments
  const getPastAppointments = () => {
    const now = new Date();
    const past = [...consultations, ...routineAppointments]
      .filter((appointment) => {
        const appointmentDateTime = new Date(
          `${appointment.appointmentDate} ${appointment.appointmentTime}`
        );
        return appointmentDateTime < now || appointment.status === "completed";
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
        const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
        return dateB.getTime() - dateA.getTime(); // Most recent first
      });

    return past;
  };

  return {
    // State
    loading,
    consultations,
    routineAppointments,
    filters,

    setConsultations,
    setRoutineAppointments,

    // Actions
    fetchUserAppointments,
    cancelAppointment,
    rescheduleAppointment,
    getAppointmentById,
    applyFilters,

    // Computed
    getUpcomingAppointments,
    getPastAppointments,
    totalAppointments: consultations.length + routineAppointments.length,
  };
};

export default useUserAppointments;
