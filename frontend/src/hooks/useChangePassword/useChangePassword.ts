import { useState } from "react";
import axios from "axios";

interface UseChangePasswordOptions {
  endpoint: string;
}

export const useChangePassword = ({ endpoint }: UseChangePasswordOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const changePassword = async (oldPassword: string, newPassword: string) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await axios.patch(
        endpoint,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      if (response.data.success) {
        setSuccess("Password changed successfully!");
      } else {
        setError(response.data.message || "Failed to change password.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    changePassword,
    setError,
    setSuccess
  };
};
