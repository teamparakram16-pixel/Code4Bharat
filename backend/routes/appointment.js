import express from "express";
import {
  getUserAppointments,
  getExpertAppointments,
  getAppointmentByMeetId,
  createAppointment,
  updateAppointmentStatusViaEmail,
  routineResponseController,
  verifyMeetLink,
  getRoutineAppointmentById,
} from "../controllers/appointment.js";
import { createRoutineAppointment } from "../controllers/appointment.js";
import { validateMedicalRoutineAppointment } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import { checkPrakrithiAnalysisExists } from "../middlewares/checkPrakrithiAnalysisExists.js";
import wrapAsync from "../utils/wrapAsync.js";
import { checkUserLogin } from "../middlewares/users/auth.js";
import { checkRoutineAppointmentDoctorAuth } from "../middlewares/appointMentMiddlewares/appointMentMiddlewares.js";
import { handleRoutineResponseCloudinaryUpload } from "../middlewares/cloudinary/handleRoutineResponse/handleRoutineResponseCloudinaryUpload.js";
import { handleRoutineResponseDiskUpload } from "../middlewares/cloudinary/handleRoutineResponse/handleRoutineResponseDiskUpload.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";

const router = express.Router();

// Create appointment
router.post(
  "/",
  checkUserLogin,
  checkPrakrithiAnalysisExists,
  createAppointment
);

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
  checkExpertLogin,
  handleRoutineResponseDiskUpload,
  wrapAsync(checkRoutineAppointmentDoctorAuth), // <-- Place before file upload
  wrapAsync(handleRoutineResponseCloudinaryUpload),
  wrapAsync(routineResponseController)
);

// Get routine appointment by ID
router.get("/routine/:id", isLoggedIn, wrapAsync(getRoutineAppointmentById));

// Get all appointments for logged-in user

router.get("/consultations/user", checkUserLogin, getUserAppointments);

// Get all appointments for logged-in doctor/expert
router.get("/consultations/expert", checkExpertLogin, getExpertAppointments);

// Get single appointment by meetId (link check included)
router.get("/consultation/:meetId", getAppointmentByMeetId);

// Update appointment status (accept/reject)
router.patch(
  "/consultation/:appointmentId/status",
  updateAppointmentStatusViaEmail
);

router.get("/verify/:meetId", verifyMeetLink);

export default router;
