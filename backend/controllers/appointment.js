import Appointment from "../models/Appointment/Appointment.js";
import Prakriti from "../models/Prakrathi/Prakrathi.js";
import { customAlphabet } from "nanoid";
import wrapAsync from "../utils/wrapAsync.js";
import RoutineAppointment from "../models/RoutineAppointment/RoutineAppointment.js";
import ExpressError from "../utils/expressError.js";
import Expert from "../models/Expert/Expert.js";

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  10
);

// Create a new appointment
export const createAppointment = wrapAsync(async (req, res) => {
  const { expertId, appointmentDate, appointmentTime, description } = req.body;
  const userId = req.user._id;

  // Validate date & time
  if (!appointmentDate || !appointmentTime) {
    return res
      .status(400)
      .json({ message: "Appointment date and time are required." });
  }

  const datePart = new Date(appointmentDate); // YYYY-MM-DD
  const timePart = appointmentTime.split(":"); // HH:mm

  if (isNaN(datePart.getTime()) || timePart.length !== 2) {
    return res.status(400).json({ message: "Invalid date or time format." });
  }

  // Merge date + time
  datePart.setHours(parseInt(timePart[0]), parseInt(timePart[1]), 0, 0);

  if (datePart < new Date()) {
    return res
      .status(400)
      .json({ message: "Appointment must be in the future." });
  }

  // Check Prakriti exists
  const prakriti = await Prakriti.findOne({ user: userId });
  if (!prakriti) {
    return res.status(404).json({ message: "Prakriti analysis not found." });
  }

  const meetId = nanoid();
  const link = `http://localhost:5173/livestreaming/${meetId}`;
  const linkExpiresAt = new Date(datePart.getTime() + 24 * 60 * 60 * 1000);

  const appointment = await Appointment.create({
    user: userId,
    expert: expertId,
    prakriti: prakriti._id,
    description,
    appointmentDate: datePart,
    meetId,
    link,
    linkExpiresAt,
  });

  // Send confirmation email to expert
  // try {
  //   const expert = await Expert.findById(expertId);
  //   if (expert) {
  //     await sendAppointmentConfirmationMail(expert, appointment);
  //   } else {
  //     console.warn("Expert not found, email not sent.");
  //   }
  // } catch (err) {
  //   console.error("Failed to send appointment confirmation email:", err);
  // }

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully.",
    appointment,
  });
});

// Get all appointments of logged-in user
export const getUserAppointments = wrapAsync(async (req, res) => {
  const userId = req.user._id;
  console.log(userId)
  const appointments = await Appointment.find({ user: userId })
  .populate("expert", "name email")
  .populate("prakriti")
  .sort({ updatedAt: -1 });

  const routineAppointments = await RoutineAppointment.find({ userId });
  res.status(200).json({ appointments, routineAppointments });
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
    linkExpired: isExpired,
  });
});

// Update appointment status via email buttons
export const updateAppointmentStatusViaEmail = wrapAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.query;

  if (!["Accepted", "Rejected"].includes(status))
    return res.status(400).send("Invalid status");

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) return res.status(404).send("Appointment not found");

  appointment.status = status;
  await appointment.save();

  res.status(200).json(`Appointment ${status.toLowerCase()} successfully.`);
});

// Verify meeting link
export const verifyMeetLink = wrapAsync(async (req, res) => {
  const { meetId } = req.params;
  const appointment = await Appointment.findOne({ meetId });

  if (!appointment)
    return res.status(404).json({ message: "No such appointment found" });
  if (appointment.linkExpiresAt < new Date())
    return res.status(403).json({ message: "expired" });

  return res.status(200).json({ message: "success" });
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
  let prakrithiAnalysisId = req.user.prakritiAnalysis.analysisRef;
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

export const getRoutineAppointmentById = async (req, res) => {
  const { id } = req.params;
  const appointment = await RoutineAppointment.findById(id)
    .populate("userId", "username email profile")
    .populate("doctorId", "username email profile")
    .populate("prakrithiAnalysis");

  if (!appointment) {
    throw new ExpressError(404, "Routine appointment not found.");
  }

  // Convert Mongoose document to plain object
  const appointmentObj = appointment.toObject();

  // Rename userId and doctorId to user and doctor
  appointmentObj.user = appointmentObj.userId;
  delete appointmentObj.userId;
  appointmentObj.doctor = appointmentObj.doctorId;
  delete appointmentObj.doctorId;

  res.status(200).json({ routineAppointment: appointmentObj });
};
