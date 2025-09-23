import express from "express";
import {
  getUserAppointments,
  getExpertAppointments,
  getAppointmentByMeetId,
  createAppointment,
  updateAppointmentStatus,
  routineResponseController,
} from "../controllers/appointment.js";
import { createRoutineAppointment } from "../controllers/appointment.js";
import { validateMedicalRoutineAppointment } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import { checkPrakrithiAnalysisExists } from "../middlewares/checkPrakrithiAnalysisExists.js";
import wrapAsync from "../utils/wrapAsync.js";
import { checkUserLogin } from "../middlewares/users/auth.js";
import { checkRoutineAppointmentDoctorAuth } from "../middlewares/appointMentMiddlewares/appointMentMiddlewares.js";
import { handleRoutineResponseCloudinaryUpload } from "../middlewares/cloudinary/handleRoutineResponse/handleRoutineResponseCloudinaryUpload.js";
import { handleRoutineResponseDiskUpload } from "../middlewares/cloudinary/handleRoutineResponse/handleRoutineResponseDiskUpload.js";

const router = express.Router();

// Create appointment
router.post("/", createAppointment);

// Create routine appointment (with validation and Prakrithi analysis check)
router.post(
  "/routine",
  checkUserLogin,
  validateMedicalRoutineAppointment,
  checkPrakrithiAnalysisExists,
  wrapAsync(createRoutineAppointment)
);

// Doctor's response to routine appointment
router.patch(
  "/routine/:id/response",
  checkUserLogin,
  handleRoutineResponseDiskUpload,
  checkRoutineAppointmentDoctorAuth, // <-- Place before file upload
  wrapAsync(handleRoutineResponseCloudinaryUpload),
  wrapAsync(routineResponseController)
);

// Get all appointments for logged-in user
router.get("/consulations/user", getUserAppointments);

// Get all appointments for logged-in doctor/expert
router.get("/consultations/expert", getExpertAppointments);

// Get single appointment by meetId (link check included)
router.get("/consultation/:meetId", getAppointmentByMeetId);

// Update appointment status (accept/reject)
router.patch("/consultation/:appointmentId/status", updateAppointmentStatus);

export default router;
