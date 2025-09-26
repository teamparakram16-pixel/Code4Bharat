import dotenv from "dotenv";
import { sendEmail } from "./sendEmail.js";

// Load environment variables
dotenv.config();

/**
 * Send appointment confirmation email to doctor
 * @param {Object} doctor - { name, email }
 * @param {Object} appointment - { _id, appointmentDate, description, link? }
 * @param {string} patientName - Name of the patient
 */
export const sendAppointmentMail = async (doctor, appointment, patientName) => {
  try {
    if (!doctor?.email) {
      console.warn("Doctor email is missing, skipping email.");
      return;
    }

    const subject = "New Appointment Scheduled";

    // Use environment variable for frontend URL
    const frontendUrl = process.env.VITE_API_URL || "http://localhost:5173";

    const emailBody = `
  <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f6f4ef; color: #3e3e3e; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd4c6; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); padding: 30px;">
      
      <h2 style="color: #4b6043;">Hello Dr. ${doctor.name},</h2>
      
      <p style="font-size: 16px; line-height: 1.6;">${patientName} has booked a new appointment.</p>

      ${
        appointment
          ? `
            <div style="margin-top: 20px;">
              <p style="margin: 8px 0;"><strong style="color: #6b8e23;">Appointment Date:</strong> ${new Date(
                appointment.appointmentDate
              ).toLocaleString()}</p>
              <p style="margin: 8px 0;"><strong style="color: #6b8e23;">Description:</strong> ${
                appointment.description || "No description provided"
              }</p>
              <p style="margin: 20px 0;">
                <a href="${frontendUrl}/doctor/appointments/${appointment.meetId}" 
                   style="display: inline-block; padding: 12px 20px; background-color: #6b8e23; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   View Details
                </a>
              </p>
              ${
                appointment.link
                  ? `<p style="margin: 8px 0;"><strong style="color: #6b8e23;">Meeting Link:</strong> <a href="${appointment.link}" style="color: #1976d2;">${appointment.link}</a></p>`
                  : ""
              }
            </div>
          `
          : ""
      }

      <p style="margin-top: 30px; font-size: 15px;">Regards,<br/>ArogyaPath Team</p>
    </div>
  </div>
`;


    // Call sendEmail with positional parameters (your existing function)
    await sendEmail(doctor.email, subject, emailBody);

    console.log(`Appointment confirmation email sent to ${doctor.email}`);
  } catch (error) {
    console.error("Failed to send appointment confirmation email:", error);
    throw error;
  }
};
