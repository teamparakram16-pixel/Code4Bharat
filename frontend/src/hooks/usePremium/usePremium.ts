import useApi from "@/hooks/useApi/useApi";
import { toast } from "react-toastify";
import { handleAxiosError } from "@/utils/handleAxiosError";
import {
  CreatePremiumOrderResponse,
  VerifyPremiumPaymentPayload,
  VerifyPremiumPaymentResponse,
} from "./usePremium.types";

const usePremium = () => {
  const { post, get } = useApi();

  const fetchPremiumOptions = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/premium`
      );
      if (!response?.success || !Array.isArray(response.data)) {
        toast.error("Failed to load premium plans.");
        return null;
      }
      return response;
    } catch (err) {
      handleAxiosError(err);
      return null;
    }
  };

  const createPremiumOrder = async (planId: string) => {
    try {
      const response: CreatePremiumOrderResponse = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/premium/${planId}/buy`,
        {}
      );
      if (!response?.success) {
        toast.error("Failed to create order. Please try again.");
        return null;
      }
      toast.success("Order created successfully. Proceed to payment.");
      return response;
    } catch (err) {
      handleAxiosError(err);
      return null;
    }
  };

  const verifyPremiumPayment = async (
    planId: string,
    paymentData: VerifyPremiumPaymentPayload
  ) => {
    try {
      const response: VerifyPremiumPaymentResponse = await post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/premium/${planId}/payment-confirm`,
        paymentData
      );
      if (response?.success) {
        toast.success("Payment successful! You are now a premium member.");
      } else {
        toast.error(response?.message || "Payment verification failed.");
      }
      return response;
    } catch (err) {
      handleAxiosError(err);
      return null;
    }
  };

  return { createPremiumOrder, verifyPremiumPayment, fetchPremiumOptions };
};

export default usePremium;
