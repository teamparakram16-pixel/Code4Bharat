import { sendEmail } from "./sendEmail.js"
import ExpressError from "./expressError.js";


export const sendChatInfoEmail = async (senderName,senderEmail, recieverEmail) => {
    try {
        const subject = `You have a chat Request from ${senderName} having matching Prakrithi Score !`;
        const chatLink = `${process.env.VITE_API_URL}/u/chat-requests/recieved`;
        const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>You've received a new chat request</h2>
        <p><strong>From:</strong> ${senderEmail}</p>
        <p>Please follow this link to view the request <strong>${chatLink}</strong></p>
        <br/>
        <p>Regards,<br/> Team ArogyaPath </p>
      </div>
    `;

    await sendEmail(recieverEmail,subject,emailBody);
    } catch (error) {
        throw new ExpressError(500, "Error sending Email to the user . Try Again !")
    }
}