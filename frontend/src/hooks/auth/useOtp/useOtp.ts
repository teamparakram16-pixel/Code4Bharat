import useApi from "@/hooks/useApi/useApi";
import { toast } from "react-toastify";
import { handleAxiosError } from "@/utils/handleAxiosError";

const useOtp = () => {
  const { post } = useApi();

  const sendOtpForContactVerification = async () => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/otp/send-otp-contact`,
        {}
      );
      if (!response?.success) {
        toast.error(response?.message || "Failed to send OTP.");
        return null;
      }
      toast.success(
        `For demo, OTP sent to your registered email (${response.email}). Later, it will be sent to your mobile (${response.contactNo}) via Twilio.`
      );

      return response;
    } catch (err) {
      handleAxiosError(err);
      return null;
    }
  };

  const verifyPhoneNumber = async (otp: string) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/otp/verify-otp-contact`,
        { otp }
      );
      if (response?.success) {
        toast.success("Contact number verified successfully.");
      } else {
        toast.error(response?.message || "OTP verification failed.");
      }
      return response;
    } catch (err) {
      handleAxiosError(err);
      return null;
    }
  };

  return { sendOtpForContactVerification, verifyPhoneNumber };
};

export default useOtp;
