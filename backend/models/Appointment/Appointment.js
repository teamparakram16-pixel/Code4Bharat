import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
    prakriti: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prakrithi",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    description:{
      type:String,
    },
    meetId: {
      type: String,
      required: true,
      unique: true,
    },
    link: {
      type: String, 
      default: null,
    },
    linkExpiresAt: {
      type: Date,
      default: null,
    },
  },
 { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
