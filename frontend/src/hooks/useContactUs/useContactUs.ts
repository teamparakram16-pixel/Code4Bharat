import useApi from "@/hooks/useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { ContactUsPayload } from "./useContactUs.types";

const useContactUs = () => {
  const { post } = useApi();

  const contactUs = async (data: ContactUsPayload) => {
    try {
      const reponse = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/contact/us`,
        data
      );
      return reponse;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  return { contactUs };
};

export default useContactUs;
