// useApi.types.ts

export interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface RequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, any>;
  }

  // Define the expected error response shape
export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

  