import ExpressError from "./expressError.js";
import { sendEmail } from "./sendEmail.js";

export const sendEmailVerificationLink = async (
  email,
  userId,
  userType,
  token,
  userName
) => {
  const verificationLink = `${process.env.VITE_API_URL}/email/verify/${userId}/${token}?type=${userType}`;

  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: #2e7d32; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0;">Welcome to ArogyaPath</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
          <p style="margin-top: 0;">Dear ${userName || "Valued User"},</p>
          
          <p>Thank you for joining ArogyaPath! We're excited to have you as part of our community dedicated to holistic wellness through Ayurveda.</p>
          
          <p>To ensure the security of your account and access all features, please verify your email address by clicking the button below:</p>
          
          <!-- Verification Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="display: inline-block; 
                      background-color: #2e7d32; 
                      color: #ffffff; 
                      text-decoration: none;
                      padding: 15px 30px;
                      border-radius: 5px;
                      font-weight: bold;
                      font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            If the button doesn't work, you can copy and paste this link into your browser:
            <br>
            <a href="${verificationLink}" style="color: #2e7d32; word-break: break-all;">
              ${verificationLink}
            </a>
          </p>
          
          <p style="font-size: 14px; color: #666;">
            This verification link will expire in 24 hours for security reasons.
          </p>
          
          <!-- Security Notice -->
          <div style="margin-top: 30px; padding: 20px; background: #f8f8f8; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              If you didn't create an account with ArogyaPath, please ignore this email or contact our support team.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; text-align: center; background: #f4f4f4; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            Best regards,<br>
            <strong style="color: #2e7d32;">The ArogyaPath Team</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const subject = "Verify Your ArogyaPath Account";
    await sendEmail(email, subject, emailBody);
    return true;
  } catch (error) {
      console.log("Error sending Email : ", error);
      throw new ExpressError(500,"Error sending Email !");
  }
};
