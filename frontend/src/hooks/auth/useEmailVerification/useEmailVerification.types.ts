export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface VerifyEmailParams {
  id: string;
  token: string;
  type?: "User" | "Expert";
}
