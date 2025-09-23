import express from "express";
import {
  getUserAppointments,
  getExpertAppointments,
  getAppointmentByMeetId,
  createAppointment,
  updateAppointmentStatusViaEmail,
  verifyMeetLink
} from "../controllers/appointment.js";

const router = express.Router();

// Create appointment
router.post("/", createAppointment);

// Get all appointments for logged-in user
router.get("/consultations/user", getUserAppointments);

// Get all appointments for logged-in doctor/expert
router.get("/consultations/expert", getExpertAppointments);

// Get single appointment by meetId (link check included)
router.get("/consultation/:meetId", getAppointmentByMeetId);

// Update appointment status via email buttons
router.get("/consultation/:appointmentId/status", updateAppointmentStatusViaEmail);

// Verify meeting link
router.get("/verify/:meetId", verifyMeetLink);

export default router;
