import Appointment from "../models/Appointment/Appointment.js";
import Prakriti from "../models/Prakrathi/Prakrathi.js";
import { customAlphabet } from "nanoid";
import wrapAsync from "../utils/wrapAsync.js";
import { sendAppointmentConfirmationMail } from "../utils/sendAppointmentConfirmationMail.js";
import Expert from "../models/Expert/Expert.js";

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  10
);

// Create a new appointment
export const createAppointment = wrapAsync(async (req, res) => {
  const { expertId, appointmentDate, description } = req.body;
  const userId = req.user._id;

  if (!appointmentDate || isNaN(new Date(appointmentDate))) {
    return res.status(400).json({ message: "Invalid or missing appointmentDate." });
  }
  const appointmentDateObj = new Date(appointmentDate);

  const prakriti = await Prakriti.findOne({ user: userId });
  if (!prakriti) return res.status(404).json({ message: "Prakriti analysis not found." });

  const meetId = nanoid();
  const link = `http://localhost:5173/livestreaming/${meetId}`;
  const linkExpiresAt = new Date(appointmentDateObj.getTime() + 24 * 60 * 60 * 1000);

  const appointment = await Appointment.create({
    user: userId,
    expert: expertId,
    prakriti: prakriti._id,
    description,
    appointmentDate: appointmentDateObj,
    meetId,
    link,
    linkExpiresAt,
  });

  // Send confirmation email to expert
  try {
    const expert = await Expert.findById(expertId);
    if (expert) {
      await sendAppointmentConfirmationMail(expert, appointment);
    } else {
      console.warn("Expert not found, email not sent.");
    }
  } catch (err) {
    console.error("Failed to send appointment confirmation email:", err);
  }

  res.status(201).json({ message: "Appointment booked successfully.", appointment });
});

// Get all appointments of logged-in user
export const getUserAppointments = wrapAsync(async (req, res) => {
  const userId = req.user._id;
  const appointments = await Appointment.find({ user: userId })
    .populate("expert", "name email")
    .populate("prakriti");
  res.status(200).json({ appointments });
});

// Get all appointments for logged-in doctor/expert
export const getExpertAppointments = wrapAsync(async (req, res) => {
  const expertId = req.user._id;
  const appointments = await Appointment.find({ expert: expertId })
    .populate("user", "name email")
    .populate("prakriti");
  res.status(200).json({ appointments });
});

export const getAppointmentByMeetId = wrapAsync(async (req, res) => {
  const { meetId } = req.params;
  const appointment = await Appointment.findOne({ meetId })
    .populate("user", "name email")
    .populate("expert", "name email")
    .populate("prakriti");

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found." });
  }

  // Add a field indicating if the link is expired
  const isExpired = appointment.linkExpiresAt < new Date();

  res.status(200).json({ 
    appointment, 
    linkExpired: isExpired 
  });
});


// Update appointment status via email buttons
export const updateAppointmentStatusViaEmail = wrapAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.query;

  if (!["Accepted", "Rejected"].includes(status)) return res.status(400).send("Invalid status");

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) return res.status(404).send("Appointment not found");

  appointment.status = status;
  await appointment.save();

  res.send(`Appointment ${status.toLowerCase()} successfully.`);
});

// Verify meeting link
export const verifyMeetLink = wrapAsync(async (req, res) => {
  const { meetId } = req.params;
  const appointment = await Appointment.findOne({ meetId });

  if (!appointment) return res.status(404).json({ message: "No such appointment found" });
  if (appointment.linkExpiresAt < new Date()) return res.status(403).json({ message: "expired" });

  return res.status(200).json({ message: "success" });
});
