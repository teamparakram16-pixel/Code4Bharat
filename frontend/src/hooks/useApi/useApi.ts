import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { ErrorResponse, RequestOptions } from "./useApi.types"; // Import types

const useApi = <T = any>() => {
  const request = async (
    method: Method,
    url: string,
    payload?: any,
    options?: RequestOptions
  ) => {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: options?.headers || {},
      withCredentials: true, // Ensures cookies are included in cross-origin requests
    };

    // For GET and DELETE requests, use params
    if (method === "get" || method === "delete") {
      config.params = options?.params;
    } else {
      config.data = payload;
    }

    try {
      const response = await axios.request<T>(config);
      return response.data as T;
    } catch (err: any) {
      console.log("Error : ", err);
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;
      let errorMessage = "Something went wrong";

      // Enhanced error handling
      switch (status) {
        case 400:
          errorMessage =
            error.response?.data?.message ||
            "Bad request. Please check your input.";
          break;
        case 401:
          errorMessage = "Not authenticated. Please login.";
          break;

        case 403:
          errorMessage =
            error.response?.data?.message ||
            "Forbidden. You don't have permission for this action.";
          break;
        case 404:
          errorMessage = "Resource not found.";
          break;
        case 409:
          errorMessage = error.response?.data?.message || "Conflict occurred.";
          break;
        case 422:
          errorMessage =
            error.response?.data?.message ||
            "Validation failed. Please check your input.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
      }

      console.error(
        `API Error [${status}]: ${errorMessage}`,
        error.response?.data
      );

      // Return error response for handling in components
      throw {
        message: errorMessage,
        status,
        data: error.response?.data,
        isAxiosError: true,
      };
    }
  };

  const enhancedPost = async (
    url: string,
    payload: any,
    options?: RequestOptions
  ): Promise<any> => {
    const response = await request("post", url, payload, options);
    return response;
  };

  return {
    get: (url: string, options?: RequestOptions) =>
      request("get", url, null, options),
    post: enhancedPost,
    put: (url: string, payload: any, options?: RequestOptions) =>
      request("put", url, payload, options),
    patch: (url: string, payload: any, options?: RequestOptions) =>
      request("patch", url, payload, options),
    del: (url: string, options?: RequestOptions) =>
      request("delete", url, null, options),
  };
};

export default useApi;
