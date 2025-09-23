import { toast } from "react-toastify";
import useApi from "../useApi/useApi";
import { PrakrithiFormType, PrakrithiStatusType } from "./usePrakrithi.types";
import { handleAxiosError } from "@/utils/handleAxiosError";

const usePrakrithi = () => {
  const { get, post } = useApi();

  const fetchPrakrithiStatus = async (): Promise<
    PrakrithiStatusType | undefined
  > => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/prakrithi`
      );
      if (response.success) {
        return response.data as PrakrithiStatusType;
      } else {
        toast.error("Failed to fetch Prakrithi status");
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const getSimilarPrakrithiUsers = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/prakrithi/similar_users`
      );
      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const findPrakrithi = async (data: PrakrithiFormType) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/prakrithi`,
        data
      );
      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const emailPkPdf = async (pdfBlob: Blob | null) => {
    try {
      if (!pdfBlob) return;
      const formData = new FormData();
      formData.append("pdf", pdfBlob, "prakriti-analysis.pdf");

      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/prakrithi/email/pdf`,
        formData
      );

      if (response.success) {
        toast.success("Pdf sent to your registered email");
      }

      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return {
    fetchPrakrithiStatus,
    getSimilarPrakrithiUsers,
    findPrakrithi,
    emailPkPdf,
  };
};

export default usePrakrithi;
