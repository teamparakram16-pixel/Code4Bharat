import { sendEmail } from "./sendEmail.js";

export const sendAppointmentConfirmationMail = async (expert, appointment = null) => {
  try {
    const subject = "New Appointment Scheduled";

    let emailBody = `
      <p>Dear ${expert.name},</p>
      <p>You have a new appointment scheduled.</p>
    `;

    if (appointment) {
      emailBody += `
        <p><strong>Appointment Date:</strong> ${appointment.appointmentDate}</p>
        <p><strong>Description:</strong> ${appointment.description || "No description provided"}</p>
        <p>
          <a href="${process.env.BACKEND_URL}/api/appointment/consultation/${appointment._id}/status?status=Accepted" 
            style="display:inline-block;padding:10px 20px;margin-right:10px;background-color:green;color:white;text-decoration:none;border-radius:5px;">
            Accept
          </a>
          <a href="${process.env.BACKEND_URL}/api/appointment/consultation/${appointment._id}/status?status=Rejected" 
            style="display:inline-block;padding:10px 20px;background-color:red;color:white;text-decoration:none;border-radius:5px;">
            Reject
          </a>
        </p>
        <p>Meeting Link: <a href="${appointment.link}">${appointment.link}</a></p>
      `;
    }

    emailBody += `<p>Regards,<br/>ArogyaPath Team</p>`;

    await sendEmail(expert.email, subject, emailBody);
    console.log(`Appointment confirmation email sent to ${expert.email}`);
  } catch (error) {
    console.error("Failed to send appointment confirmation email:", error);
    throw error;
  }
};
