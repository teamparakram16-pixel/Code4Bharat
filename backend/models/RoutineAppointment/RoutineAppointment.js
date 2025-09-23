import mongoose, { Schema } from "mongoose";

// You may want to import your Zod schema and use z.infer<> for TypeScript types, but for Mongoose, define the shape here:
const appointmentDataSchema = {
  // Professional Information
  profession: { type: String, required: true },
  workHours: { type: String, required: true },
  workEnvironment: { type: String, required: true },
  physicalActivity: { type: String, required: true },

  // Daily Routine
  wakeUpTime: { type: String, required: true },
  sleepTime: { type: String, required: true },
  mealTimes: {
    breakfast: { type: String, required: true },
    lunch: { type: String, required: true },
    dinner: { type: String, required: true },
  },
  exerciseTime: { type: String, required: true },
  exerciseType: { type: String, required: true },

  // Health Issues
  currentHealthIssues: [{ type: String, required: true }],
  healthConcerns: { type: String, required: true },
  energyLevels: { type: String, required: true },
  stressLevels: { type: String, required: true },

  // Medical History
  medicalHistory: { type: String, required: true },
  surgeries: { type: String, required: true },
  allergies: { type: String, required: true },
  familyHistory: { type: String, required: true },

  // Current Medications
  medications: { type: String, required: true },
  supplements: { type: String, required: true },

  // Diet and Nutrition
  dietType: { type: String, required: true },
  foodPreferences: { type: String, required: true },
  foodAvoidances: { type: String, required: true },
  waterIntake: { type: String, required: true },

  // Goals and Expectations
  healthGoals: [{ type: String, required: true }],
  specificConcerns: { type: String, required: true },
  expectations: { type: String, required: true },

  // Mental Health and Lifestyle
  mentalHealthConcerns: { type: String, required: true },
  lifeChanges: { type: String, required: true },
  socialSupport: { type: String, required: true },
  hobbies: { type: String, required: true },
};

const RoutineAppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
    appointmentData: {
      type: appointmentDataSchema,
      required: true,
    },
    prakrithiAnalysis: {
      type: Schema.Types.ObjectId,
      ref: "Prakrithi",
      required: true,
    },
    routineResponse: {
      pdfUrl: { type: String, default: "" },
      createdAt: { type: Date, default: null },
    },
    paymentId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "viewed", "uploaded", "seen"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const RoutineAppointment = new mongoose.model(
  "RoutineAppointment",
  RoutineAppointmentSchema
);

export default RoutineAppointment;
