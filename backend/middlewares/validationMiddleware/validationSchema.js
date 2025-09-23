import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;
const objectIdSchema = z
  .string()
  .regex(objectIdRegex, "Invalid MongoDB ObjectId");

// -------------------- Auth Schemas --------------------
export const userSignupSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const expertSignupSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  expertType: z.enum(["ayurvedic", "naturopathy"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password is required"),
  role: z.enum(["User", "Expert"]),
});

// -------------------- User Schema --------------------
export const userSchemaZod = z.object({
  fullname: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  age: z
    .number()
    .int()
    .min(1, "Age must be at least 1")
    .max(120, "Age cannot exceed 120"),
  contact: z.string().regex(/^[0-9]{10}$/, "Contact must be exactly 10 digits"),
  username: z.string().min(3).max(20).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

// -------------------- Expert Schema --------------------
export const expertSchemaZod = z.object({
  fullname: z.string().min(1, "Full name is required").max(50),
  email: z.string().email("Invalid email format"),
  contact: z.string().regex(/^[0-9]{10}$/, "Contact must be exactly 10 digits"),
  profile: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    experience: z.number().min(0, "Experience cannot be negative"),
    qualification: z.string().min(1, "Qualification is required"),
    specialization: z.string().min(1, "Specialization is required"),
  }),
  isVerified: z.boolean().optional(),
});

// -------------------- Post Schema --------------------
export const postSchemaZod = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export const routineSchemaZod = z.object({
  title: z.string(),
  description: z.string(),
  routines: z
    .array(
      z.object({
        time: z.string().min(1, "Time is required"),
        content: z.string().min(1, "Content is required"),
      })
    )
    .min(1, "At least one routine is required"),
});

// -------------------- SuccessStory Schema --------------------

export const successStorySchemaZod = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tagged: z
    .array(objectIdSchema)
    .max(5, "Cannot exceed 5 tagged experts")
    .optional(),
  routines: z.array(z.record(z.any())).optional(),
});

// -------------------- Comment Schema --------------------
export const commentSchemaZod = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  repliedTo: objectIdSchema.nullable().optional(), // commentId, null if not a reply
});

// -------------------- Prakrithi Schema --------------------
export const prakrithiSchema = z.object({
  Name: z.string(),
  Age: z.number().int().min(0),
  Gender: z.string(),
  Height: z.number().min(0),
  Weight: z.number().min(0),
  Body_Type: z.string(),
  Skin_Type: z.string(),
  Hair_Type: z.string(),
  Facial_Structure: z.string(),
  Complexion: z.string(),
  Eyes: z.string(),
  Food_Preference: z.string(),
  Bowel_Movement: z.string(),
  Thirst_Level: z.string(),
  Sleep_Duration: z.number().min(0).max(24),
  Sleep_Quality: z.string(),
  Energy_Levels: z.string(),
  Daily_Activity_Level: z.string(),
  Exercise_Routine: z.string(),
  Food_Habit: z.string(),
  Water_Intake: z.string(),
  Health_Issues: z.string(),
  Hormonal_Imbalance: z.string(),
  Skin_Hair_Problems: z.string(),
  Ayurvedic_Treatment: z.string(),
});

// -------------------- Password Schemas --------------------
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  role: z.enum(["user", "expert"]),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "expert"]),
});

// -------------------- Expert Complete Profile --------------------
export const expertProfileSchema = z.object({
  profile: z.object({
    contactNo: z.number().min(1000000000).max(9999999999),
    expertType: z.enum(["ayurvedic", "naturopathy"]),
    experience: z.number().min(0).default(0),
    qualifications: z.array(
      z.object({
        degree: z.string().min(1),
        college: z.string().min(1),
        year: z.string().min(1),
      })
    ),
    address: z.object({
      country: z.string().default("Bharat"),
      city: z.string().min(1),
      state: z.string().min(1),
      pincode: z.string().regex(/^\d{6}$/),
      clinicAddress: z.string().default(""),
    }),
    specialization: z.array(z.string()).default([]),
    bio: z.string().default(""),
    languagesSpoken: z.array(z.string()).default([]),
  }),
  verificationDetails: z.object({
    dateOfBirth: z.string().datetime("Invalid ISO datetime"),
    gender: z.enum(["male", "female", "other"]),
    registrationDetails: z.object({
      registrationNumber: z.string().min(1),
      registrationCouncil: z.string().min(1),
      yearOfRegistration: z.number().min(1900).max(new Date().getFullYear()),
    }),
  }),
});

// -------------------- User Profile Schema --------------------
export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const userProfileSchema = z.object({
  fullName: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date ? new Date(val) : val,
    z.date().refine(
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
    )
  ),
  contactNo: z.string().min(10).max(15),
  email: z.string().email().optional().or(z.literal("")),
  currentCity: z.string().min(1),
  state: z.string().min(1),
  healthGoal: z.string().min(1),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

// -------------------- Chat Schemas --------------------
export const chatRequestSchemaZod = z
  .object({
    chatType: z.enum(["private", "group"]),
    groupName: z.string().optional(),
    users: z.array(
      z.object({
        user: objectIdSchema,
        userType: z.enum(["User", "Expert"]),
      })
    ),
    chatReason: z.object({
      similarPrakrithi: z.boolean(),
      otherReason: z.string().nullable().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    const userIds = data.users?.map((u) => u.user?.toString());
    const duplicates = userIds?.filter(
      (id, index) => userIds.indexOf(id) !== index
    );

    if (duplicates && duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate user IDs are not allowed.",
        path: ["users"],
      });
    }

    const invalidUserIds = userIds?.filter((id) => !objectIdRegex.test(id));
    if (invalidUserIds && invalidUserIds.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid user ID(s): ${invalidUserIds.join(", ")}`,
        path: ["users"],
      });
    }

    if (data.chatType === "group") {
      if (!data.users || data.users.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group chat must have at least 2 users.",
          path: ["users"],
        });
      }
      if (!data.groupName || data.groupName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group name is required for group chat.",
          path: ["groupName"],
        });
      }
    } else if (data.chatType === "private") {
      if (!data.users || data.users.length !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Private chat must have exactly 1 user.",
          path: ["users"],
        });
      }
      if (data.groupName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group name should not be present for private chat.",
          path: ["groupName"],
        });
      }
    }
  });

export const usersIdsSchema = z
  .object({
    participants: z
      .array(
        z.object({
          userType: z.enum(["User", "Expert"]),
          user: z.string().regex(objectIdRegex, "Invalid ObjectId format"),
        })
      )
      .nonempty("Participants array must contain at least one valid ObjectId"),
  })
  .refine(
    (data) => {
      const userIds = data.participants.map((p) => p.user);
      const uniqueUserIds = new Set(userIds);
      return userIds.length === uniqueUserIds.size;
    },
    {
      path: ["participants"],
      message: "Duplicate users are not allowed in participants array",
    }
  );

export const contactUsSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const razorpayPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, "razorpay_order_id is required"),
  razorpay_payment_id: z.string().min(1, "razorpay_payment_id is required"),
  razorpay_signature: z.string().min(1, "razorpay_signature is required"),
  // Optionally, add more fields if you expect them
});

// -------------------- Medical Routine Appointment Schema --------------------
export const medicalRoutineAppointmentSchema = z.object({
  // Professional Information
  profession: z.string(),
  workHours: z.string(),
  workEnvironment: z.string(),
  physicalActivity: z.string(),

  // Daily Routine
  wakeUpTime: z.string(),
  sleepTime: z.string(),
  mealTimes: z.object({
    breakfast: z.string(),
    lunch: z.string(),
    dinner: z.string(),
  }),
  exerciseTime: z.string(),
  exerciseType: z.string(),

  // Health Issues
  currentHealthIssues: z.array(z.string()),
  healthConcerns: z.string(),
  energyLevels: z.string(),
  stressLevels: z.string(),

  // Medical History
  medicalHistory: z.string(),
  surgeries: z.string(),
  allergies: z.string(),
  familyHistory: z.string(),

  // Current Medications
  medications: z.string(),
  supplements: z.string(),

  // Diet and Nutrition
  dietType: z.string(),
  foodPreferences: z.string(),
  foodAvoidances: z.string(),
  waterIntake: z.string(),

  // Goals and Expectations
  healthGoals: z.array(z.string()),
  specificConcerns: z.string(),
  expectations: z.string(),

  // Mental Health and Lifestyle
  mentalHealthConcerns: z.string(),
  lifeChanges: z.string(),
  socialSupport: z.string(),
  hobbies: z.string(),
});

// -------------------- Default Export --------------------
export default {
  userSchemaZod,
  expertSchemaZod,
  postSchemaZod,
  routineSchemaZod,
  successStorySchemaZod, // ✅ FIXED: Added here
  commentSchemaZod,
  prakrithiSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  expertProfileSchema,
  userProfileSchema,
  chatRequestSchemaZod,
  usersIdsSchema,
  userSignupSchema,
  expertSignupSchema,
  loginSchema,
  razorpayPaymentSchema,
  medicalRoutineAppointmentSchema,
};
