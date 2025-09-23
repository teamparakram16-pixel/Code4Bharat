import { sendEmail } from "./sendEmail.js";
import ExpressError from "./expressError.js";

export const chatRequestStatusEmail = async (senderName, requestStatus, receiverEmail) => {
  try {
    const isRejected = Boolean(requestStatus && requestStatus && requestStatus !== "accepted");

    const subject = isRejected
      ? `Your Chat Request was Rejected by ${senderName}`
      : `Your Chat Request was Accepted by Dr. ${senderName}`;

    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Your Chat Request Update</h2>
        <p>Dear User,</p>
        <p>Your chat request has been viewed by <strong>${senderName}</strong>.</p>
        ${isRejected
        ? `
            <p style="color: red;"><strong>Unfortunately, your chat request was rejected.</strong></p>
            <p>The user you reached out to has chosen not to proceed with the chat at this time. Don't be discouraged — ArogyaPath is filled with many others who share similar health goals and Prakrithi profiles.</p>
            <p>You can explore and send chat requests to other users by visiting the following link:</p>
            <a href="${process.env.VITE_API_URL}/u/chat-requests/sent" style="color: #2e7d32; font-weight: bold;">Go to Chat Requests</a>
          `
        : `<p style="color: green;"><strong>Good news! Your chat request has been accepted.</strong></p>
               <p>You can now start chatting with ${senderName} through your ArogyaPath dashboard.</p>`
      }
        <br /><br />
        <p>Stay connected, stay healthy!</p><br/><br/>
        <p>Regards,<br />Team ArogyaPath</p>
      </div>
    `;

    await sendEmail(receiverEmail, subject, emailBody);
  } catch (error) {
    throw new ExpressError(500, "Error sending email to the user. Try Again!");
  }
};
