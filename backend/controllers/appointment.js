// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";
import Prakriti from "../models/Prakriti.js";
import { customAlphabet } from "nanoid";
import wrapAsync from "../utils/wrapAsync.js";

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
    return res.status(400).json({ message: "Invalid or missing appointmentDate." });
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
  const linkExpiresAt = new Date(appointmentDateObj.getTime() + 24 * 60 * 60 * 1000);

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

// ================================
// Verify meeting link
// ================================
export const verifyMeetLink = wrapAsync(async (req, res) => {
  const { meetId } = req.params;

  const appointment = await Appointment.findOne({ meetId });

  if (!appointment) {
    return res.status(404).json({ message: "no such appointments found" }); // appointment not found
  }

  // Check if link is still valid
  if (appointment.linkExpiresAt < new Date()) {
    return res.status(403).json({ message: "expired" }); // link expired
  }

  // If valid
  return res.status(200).json({ message: "success" });
});
