import { sendEmail } from "./sendEmail.js"
import ExpressError from "./expressError.js";


export const sendChatInfoEmail = async (senderName, senderEmail, percentagematch, recieverEmail) => {
  try {
    const subject = `You have a chat Request from ${senderName} having ${percentagematch} % matching Prakrithi Score !`;
    const chatLink = 'https://arogyapaths.netlify.app/u/chat-requests/recieved';
    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; background: #f9fbff; border: 1px solid #e0e7ff; padding: 20px; border-radius: 10px; color: #333;">
  <h2 style="color: #2c3e50; margin-bottom: 10px;">You've received a new chat request</h2>
  
  <p style="font-size: 15px; margin: 8px 0;">
    <strong style="color: #34495e;">From:</strong> 
    <span style="color: #2d89ef;">${senderEmail}</span>
  </p>
  
  <p style="font-size: 15px; margin: 8px 0;">
    Please follow this link to view the request:  
    <a href="${chatLink}" target="_blank" style="color: #0078d7; font-weight: bold; text-decoration: none;">
      View Chat
    </a>
  </p>
  
  <br/>
  <p style="font-size: 14px; color: #555;">
    Regards,<br/>
    <span style="font-weight: bold; color: #2c3e50;">Team ArogyaPath</span>
  </p>
</div>
    `;

    await sendEmail(recieverEmail, subject, emailBody);
    return true;
  } catch (error) {
    throw new ExpressError(500, "Error sending Email to the user . Try Again !")
  }
}