import { z } from "zod";

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const userSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.date().refine(
    (date) => {
      const today = new Date();
      const hundredYearsAgo = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
      );
      return date <= today && date >= hundredYearsAgo;
    },
    { message: "Invalid date of birth" }
  ),
  contactNo: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  currentCity: z.string().min(1, "Current city is required"),
  state: z.string().min(1, "State is required"),
  healthGoal: z.string().min(1, "Primary wellness goal is required"),
  profilePicture: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
      "Max image size is 2MB"
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png formats are supported"
    ),
  governmentId: z
    .any()
    .refine((file) => file instanceof File, "Government ID is required"),
    // .refine(
    //   (file) => file.size <= MAX_FILE_SIZE,
    //   "Max file size is 2MB"
    // )
    // .refine(
    //   (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    //   "Only .jpg, .jpeg, .png formats are supported"
    // ),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export type UserFormData = z.infer<typeof userSchema>;