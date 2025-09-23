import { useState } from "react";
import { Doctor } from "./useDoctor.types";

export const useSearchDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDoctors = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/experts/search/doctors?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setDoctors(data.doctors);
      } else {
        setError(data.error || "Failed to fetch doctors");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/experts/doctors`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setDoctors(data.doctors);
      } else {
        setError(data.error || "Failed to fetch doctors");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return {
    doctors,
    loading,
    error,
    fetchDoctors,
    fetchAllDoctors,
  };
};
