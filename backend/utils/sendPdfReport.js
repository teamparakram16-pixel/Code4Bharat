import { sendEmail } from "./sendEmail.js";

// Specialized function for sending PDF reports
export const sendPdfReport = async (toEmail, pdfBuffer, userName) => {
  const subject = `Your Ayurvedic Prakriti Analysis Report`;

  const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2e7d32;">Namaste ${userName},</h2>
      <p>Thank you for completing your Ayurvedic Prakriti Analysis with ArogyaPath.</p>
      <p>Your personalized report is attached to this email. It includes:</p>
      <ul>
        <li>Your dominant Prakriti type</li>
        <li>Body constitution analysis</li>
        <li>Personalized recommendations</li>
        <li>Dietary and lifestyle guidance</li>
      </ul>
      <p>We hope this report helps you on your journey to better health and balance.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666;">With warm regards,</p>
        <p style="color: #2e7d32; font-weight: bold;">The ArogyaPath Team</p>
      </div>
    </div>
  `;

  try {
    await sendEmail(toEmail, subject, emailBody, [
      {
        filename: `Prakriti-Analysis-${userName}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ]);
  } catch (error) {
    throw error;
  }
};
