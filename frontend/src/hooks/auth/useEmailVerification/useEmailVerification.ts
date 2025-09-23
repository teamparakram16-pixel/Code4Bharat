import useApi from "@/hooks/useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import {
  EmailVerificationResponse,
  VerifyEmailParams,
} from "./useEmailVerification.types";

const useEmailVerification = () => {
  const { post, get } = useApi();

  const sendVerificationEmail = async (
    email: string
  ): Promise<EmailVerificationResponse | undefined> => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/email/send-verification`,
        { email }
      );

      if (response.success) {
        toast.success("Verification email sent successfully ");
      }

      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const verifyEmail = async ({
    id,
    token,
    type = "User",
  }: VerifyEmailParams): Promise<EmailVerificationResponse | undefined> => {
    try {
     
      const response = await get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/auth/email/verify/${id}/${token}?type=${type}`
      );

      if (response.success) {
        toast.success("Email verified successfully");
      }

      return response;
    } catch (error) {
      const errorMessage = handleAxiosError(error);

      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  };

  return {
    sendVerificationEmail,
    verifyEmail,
  };
};

export default useEmailVerification;
