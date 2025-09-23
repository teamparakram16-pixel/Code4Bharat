// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";
import Prakriti from "../models/Prakriti.js";
import { customAlphabet } from "nanoid";
import wrapAsync from "../utils/wrapAsync.js";
import RoutineAppointment from "../models/RoutineAppointment.js";
import ExpressError from "../utils/expressError.js";

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  10
);

// ================================
// Create a new appointment
// ================================
export const createAppointment = wrapAsync(async (req, res) => {
  const { expertId, appointmentDate } = req.body;
  const userId = req.user._id;

  // Validate appointmentDate
  if (!appointmentDate || isNaN(new Date(appointmentDate))) {
    return res
      .status(400)
      .json({ message: "Invalid or missing appointmentDate." });
  }

  const appointmentDateObj = new Date(appointmentDate);

  // Fetch user's Prakriti analysis
  const prakriti = await Prakriti.findOne({ user: userId });
  if (!prakriti) {
    return res.status(404).json({ message: "Prakriti analysis not found." });
  }

  // Generate unique meetId and link
  const meetId = nanoid();
  const link = `http://localhost:5173/livestreaming/${meetId}`;

  // Set link expiry to appointmentDate + 24 hours
  const linkExpiresAt = new Date(
    appointmentDateObj.getTime() + 24 * 60 * 60 * 1000
  );

  // Create the appointment
  const appointment = await Appointment.create({
    user: userId,
    expert: expertId,
    prakriti: prakriti._id,
    appointmentDate: appointmentDateObj,
    meetId,
    link,
    linkExpiresAt,
  });

  res.status(201).json({
    message: "Appointment booked successfully.",
    appointment,
  });
});

// ================================
// Get all appointments of logged-in user
// ================================
export const getUserAppointments = wrapAsync(async (req, res) => {
  const userId = req.user._id;

  const appointments = await Appointment.find({ user: userId })
    .populate("expert", "name email")
    .populate("prakriti");

  res.status(200).json({ appointments });
});

// ================================
// Get all appointments for logged-in doctor/expert
// ================================
export const getExpertAppointments = wrapAsync(async (req, res) => {
  const expertId = req.user._id;

  const appointments = await Appointment.find({ expert: expertId })
    .populate("user", "name email")
    .populate("prakriti");

  res.status(200).json({ appointments });
});

// ================================
// Get single appointment by meetId with expiry check
// ================================
export const getAppointmentByMeetId = wrapAsync(async (req, res) => {
  const { meetId } = req.params;

  const appointment = await Appointment.findOne({ meetId });

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found." });
  }

  // Check if the meeting link has expired
  if (appointment.linkExpiresAt < new Date()) {
    return res.status(403).json({ message: "Meeting link has expired." });
  }

  res.status(200).json({ appointment });
});

// ================================
// Update appointment status (accept/reject) by doctor
// ================================
export const updateAppointmentStatus = wrapAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  if (!["Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found." });
  }

  // Ensure only the assigned expert can update status
  if (appointment.expert.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized." });
  }

  appointment.status = status;
  await appointment.save();

  res.status(200).json({
    message: `Appointment ${status.toLowerCase()} successfully.`,
    appointment,
  });
});

//handleRoutineAppointment

export const createRoutineAppointment = async (req, res) => {
  // The validation middleware should have already validated req.body and attached req.validatedData
  const { doctorId, appointmentData } = req.body;
  const userId = req.user._id;

  if (!doctorId) {
    throw new ExpressError(400, "Doctor ID is required.");
  }

  const doctor = await Expert.findById(doctorId);
  if (!doctor) {
    throw new ExpressError(404, "Doctor not found.");
  }

  // Fetch user's PrakrithiAnalysis (assuming user.prakrithiAnalysis holds the ObjectId)
  let prakrithiAnalysisId = req.user.prakrithiAnalysis.analysisRef;
  if (!prakrithiAnalysisId) {
    throw new ExpressError(400, "User does not have a Prakrithi Analysis.");
  }

  // Create the RoutineAppointment
  const routineAppointment = await RoutineAppointment.create({
    userId,
    doctorId,
    appointmentData,
    prakrithiAnalysis: prakrithiAnalysisId,
    routineResponse: {
      pdfUrl: "",
      createdAt: null,
    },
    paymentId: null,
    status: "pending",
  });

  res.status(201).json({
    message: "Routine appointment created successfully.",
    routineAppointment,
  });
};

// Controller to handle routine response PDF upload
export const routineResponseController = async (req, res) => {
  const appointmentId = req.params.id;
  const pdfUrl = req.routineResponsePdfUrl;

  if (!pdfUrl) {
    throw new ExpressError(400, "No routine response PDF uploaded.");
  }

  const appointment = await RoutineAppointment.findById(appointmentId);
  if (!appointment) {
    throw new ExpressError(404, "Routine appointment not found.");
  }

  // Only the assigned doctor can upload the response
  if (appointment.doctorId.toString() !== req.user._id.toString()) {
    throw new ExpressError(
      403,
      "Not authorized to upload response for this appointment."
    );
  }

  appointment.routineResponse = {
    pdfUrl,
    createdAt: new Date(),
  };
  appointment.status = "uploaded";
  await appointment.save();

  res.status(200).json({
    message: "Routine response uploaded successfully.",
    routineResponse: appointment.routineResponse,
  });
};
