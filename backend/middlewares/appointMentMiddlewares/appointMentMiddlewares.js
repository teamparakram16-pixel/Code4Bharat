
import RoutineAppointment from "../../models/RoutineAppointment/RoutineAppointment.js";

import ExpressError from "../../utils/expressError.js";

// Middleware to check if appointment exists and doctor is authorized
export const checkRoutineAppointmentDoctorAuth = async (req, res, next) => {
  const appointmentId = req.params.id;
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

  // Attach appointment to request for downstream use if needed
  req.routineAppointment = appointment;
  next();
};

export default {
  checkRoutineAppointmentDoctorAuth
};
