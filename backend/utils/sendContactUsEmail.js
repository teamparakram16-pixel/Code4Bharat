import { sendEmail } from "./sendEmail.js";

/**
 * Utility to send Contact Us emails using the generic sendEmail function.
 * @param {string} toEmail - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} emailBody - HTML body of the email
 * @returns {Promise<any>} - Result of sendEmail
 */
export const sendContactUsEmailUtil = async (toEmail, subject, emailBody) => {
  return await sendEmail(toEmail, subject, emailBody);
};
