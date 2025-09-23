// schemas/userHealthFormSchema.ts
import { z } from "zod";

const prakrithiFormSchema = z.object({
  // Section 1: Basic Information
  Name: z.string().min(1, "Name is required"),
  Age: z.coerce.number().min(1, "Age must be a positive number"),
  Gender: z.enum(["Male", "Female", "Other"]),
  Height: z.coerce.number().min(1, "Height is required"),
  Weight: z.coerce.number().min(1, "Weight is required"),

  // Section 2: Physical Characteristics
  Body_Type: z.enum(["Heavy", "Lean", "Medium"]),
  Skin_Type: z.enum(["Dry", "Normal", "Oily"]),
  Hair_Type: z.enum(["Curly", "Straight", "Wavy"]),
  Facial_Structure: z.enum(["Oval", "Round", "Square"]),
  Complexion: z.enum(["Dark", "Fair", "Wheatish"]),

  // Section 3: Lifestyle and Habits
  Eyes: z.enum(["Large", "Medium", "Small"]),
  Food_Preference: z.enum(["Non-Veg", "Vegan", "Veg"]),
  Bowel_Movement: z.enum(["Irregular", "Regular"]),
  Thirst_Level: z.enum(["High", "Low", "Medium"]),
  Sleep_Duration: z.coerce.number().min(1, "Sleep Duration is required"),

  // Section 4: Daily Routine
  Sleep_Quality: z.enum(["Average", "Good", "Poor"]),
  Energy_Levels: z.enum(["High", "Low", "Medium"]),
  Daily_Activity_Level: z.enum(["High", "Low", "Medium"]),
  Exercise_Routine: z.enum(["Intense", "Light", "Moderate", "Sedentary"]),
  Food_Habit: z.enum(["Balanced", "Fast Food", "Home Cooked"]),

  // Section 5: Health Information
  Water_Intake: z.enum(["1", "1.5", "2", "3"]),
  Health_Issues: z.enum([
    "Diabetes",
    "Digestive Issues",
    "Hypertension",
    "None",
  ]),
  Hormonal_Imbalance: z.enum(["Yes", "No"]),
  Skin_Hair_Problems: z.enum(["Acne", "Dandruff", "Hairfall", "None"]),
  Ayurvedic_Treatment: z.enum(["Yes", "No"]),
});

export default prakrithiFormSchema;
