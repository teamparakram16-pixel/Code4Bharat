import mongoose from "mongoose";

// You may want to import your Zod schema and use z.infer<> for TypeScript types, but for Mongoose, define the shape here:
const appointmentDataSchema = {
  profession: { type: String, required: true },
  dailyRoutineDescription: { type: String, required: true },
  primaryHealthIssues: { type: String, required: true },
  medicalHistory: {
    chronicIllnesses: [{ type: String }],
    pastSurgeries: [{ type: String }],
    allergies: [{ type: String }],
  },
  currentMedications: [{ type: String }],
  dietaryHabits: { type: String, required: true },
  dietaryPreferences: [{ type: String }],
  foodAllergies: [{ type: String }],
  hydrationHabits: { type: String },
  healthGoals: { type: String, required: true },
  mentalHealth: { type: String, required: true },
  substanceUse: { type: String },
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
      pdfUrl: { type: String },
      createdAt: { type: Date },
    },
    routineResponse: {
      pdfUrl: { type: String },
      createdAt: { type: Date },
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

const RoutineAppointment = new mongoose.model("RoutineAppointment", RoutineAppointmentSchema);

export default RoutineAppointment;
