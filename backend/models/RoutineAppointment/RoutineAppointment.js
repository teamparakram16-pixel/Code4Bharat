import mongoose, { Schema } from "mongoose";

// You may want to import your Zod schema and use z.infer<> for TypeScript types, but for Mongoose, define the shape here:

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
      ref: "Prakriti",
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
