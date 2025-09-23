import { z } from "zod";

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(5, "Password must be at least 8 characters"),
});

export default loginSchema;
