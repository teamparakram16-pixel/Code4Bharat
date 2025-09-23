import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User", required: true
     },
  expert: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "Expert", required: true
     },
  prakriti: { 
    type: mongoose.Schema.Types.ObjectId, ref: "Prakriti", required: true },

  description: { type: String, maxlength: 500 },

  // Stores both date & time together
  appointmentDate: { type: Date, required: true },

  meetId: { type: String, required: true, unique: true },
  link: { type: String, required: true },
  linkExpiresAt: { type: Date, required: true },

  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
