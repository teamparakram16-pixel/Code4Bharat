import { z } from "zod";

const FileSchema = z.custom<File>((val) => val instanceof File, {
  message: "A valid file is required",
});

export const expertProfileSchema = z.object({
  // Personal Details
  expertType: z.enum(["ayurvedic", "naturopathy"], {
    required_error: "Expert type is required",
  }),
  dateOfBirth: z.date().refine((date) => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100);
    return date <= today && date >= minDate;
  }, "Please enter a valid date of birth"),
  gender: z.string().min(1, "Gender is required"),
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number cannot exceed 15 digits"),

  // Address
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().min(6, "PIN code must be 6 digits").max(6),

  // Professional Details
  ayushRegistrationNumber: z
    .string()
    .min(3, "AYUSH registration number is required")
    .regex(
      /^[A-Za-z]{2,3}\/[A-Za-z]-?\d+$/,
      "Invalid AYUSH registration format"
    ),
  registrationCouncil: z.string().min(1, "Registration council is required"),
  yearOfRegistration: z
    .string()
    .min(4, "Year must be 4 digits")
    .max(4)
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1950 && year <= currentYear;
    }, "Please enter a valid year"),

  // Qualifications
  qualifications: z
    .array(
      z.object({
        degree: z.string().min(1, "Degree is required"),
        college: z.string().min(1, "College/University is required"),
        year: z.string().min(4, "Year must be 4 digits").max(4),
      })
    )
    .nonempty("At least one qualification is required"),

  yearsOfExperience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(70, "Please enter a valid experience"),

  specializations: z
    .array(z.string())
    .nonempty("At least one specialization is required"),
  languages: z.array(z.string()).nonempty("At least one language is required"),
  // Documents
  identityProof: FileSchema.refine(
    (file) => file instanceof File && file.size <= 5 * 1024 * 1024,
    "File must be less than 5MB"
  ),
  degreeCertificate: FileSchema.refine(
    (file) => file instanceof File && file.size <= 5 * 1024 * 1024,
    "File must be less than 5MB"
  ),
  registrationProof: FileSchema.refine(
    (file) => file instanceof File && file.size <= 5 * 1024 * 1024,
    "File must be less than 5MB"
  ),
  practiceProof: FileSchema.refine(
    (file) => file instanceof File && file.size <= 5 * 1024 * 1024,
    "File must be less than 5MB"
  ),

  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
});

export type ExpertFormData = z.infer<typeof expertProfileSchema>;
