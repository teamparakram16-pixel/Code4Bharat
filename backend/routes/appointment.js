import express from "express";
import {
  getUserAppointments,
  getExpertAppointments,
  getAppointmentByMeetId,
  createAppointment,
  updateAppointmentStatus,
  verifyMeetLink
} from "../controllers/appointment.js";


const router = express.Router();

// Create appointment
router.post("/", createAppointment);

// Get all appointments for logged-in user
router.get("/consulations/user",  getUserAppointments);

// Get all appointments for logged-in doctor/expert
router.get("/consultations/expert",  getExpertAppointments);

// Get single appointment by meetId (link check included)
router.get("/consultation/:meetId",  getAppointmentByMeetId);

// Update appointment status (accept/reject)
router.patch("/consultation/:appointmentId/status",  updateAppointmentStatus);
// Verify meeting link
router.get("/verify/:meetId", verifyMeetLink);


export default router;
