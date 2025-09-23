import { useState, useEffect } from "react";
import { Doctor } from "../useDoctorSearch/useDoctor.types";

export const useDoctor = (id: string | undefined) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Doctor ID is required");
      setDoctor(null);
      setLoading(false);
      return;
    }

    const fetchDoctor = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/experts/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (res.ok) {
          setDoctor(data.doctor || data); 
        } else {
          setError(data.error || "Failed to fetch doctor");
          setDoctor(null);
        }
      } catch (err: any) {
        setError(err.message || "Unexpected error");
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  return { doctor, loading, error };
};
