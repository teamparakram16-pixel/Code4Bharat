import { z } from "zod";

const userLoginSchema = z.object({
  email: z.string(),
  password: z.string().min(1, "Password must be at least 8 characters"),
});

export default userLoginSchema;
