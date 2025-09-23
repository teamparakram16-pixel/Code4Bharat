// utils/handleAxiosError.ts

import { toast } from "react-toastify";

export const handleAxiosError = (error: any) => {
  if (error.isAxiosError) {
    const status = error.status;

    console.log('handleAxisError : ',error.message);

    switch (status) {
      case 401:
        toast.error("Either email or password is incorrect");
        break;
      case 403:
        toast.error(error.message);
        break;
      case 404:
        toast.error("Resource not found.");
        break;
      case 413:
        toast.error("File size too large.");
        break;
      case 429:
        toast.error("Too many requests - please slow down.");
        break;
      default:
        toast.error(error.message);
    }
  } else {
    toast.error(error.message || "An unknown error occurred");
  }

  throw error;
};
