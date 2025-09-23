import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  expertType: z.enum(["ayurvedic", "naturopathy"]),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export interface ExpertRegisterFormProps {
  userType: "ayurvedic" | "naturopathy";
}
