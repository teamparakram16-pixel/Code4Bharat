import { sendEmail } from "./sendEmail.js";
import ExpressError from "./expressError.js";

export const sendnewChatMessage = async (senderName, senderEmail , receiverEmail) => {
    try {
        const subject = `New Message from ${senderName} on ArogyaPath`;

        const emailBody = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2e7d32;">New Message Alert</h2>
    
    <p>Dear User,</p>
    
    <p>
      You have received a new message from <strong>${senderName} from email : ${senderEmail}</strong> on ArogyaPath.
    </p>
    
    <p>
      For your privacy and security, message content is not shared in this email. 
      Please log in to your ArogyaPath dashboard to view and respond to the message.
    </p>
    
    <p>
      If you were expecting this communication — wonderful! Otherwise, you can update your chat preferences or report concerns through your dashboard settings.
    </p>

    <p style="font-size: 0.95em; color: #777;">
      Please do not reply to this email. This is an automated notification sent from an unmonitored address.
    </p>

    <br />

    <p>Warm regards,<br />Team ArogyaPath</p>
  </div>
`;


        await sendEmail(receiverEmail, subject, emailBody);
    } catch (error) {
        throw new ExpressError(500, "Error sending email to the user. Try Again!");
    }
};
