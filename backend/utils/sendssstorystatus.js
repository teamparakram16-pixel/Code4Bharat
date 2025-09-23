import { sendEmail } from "./sendEmail.js";
import ExpressError from "./expressError.js";

export const successStoryEmail = async (postId, doctorName, reason, receiverEmail) => {
  try {
    const postLink = `https://arogyapaths.netlify.app/success-stories/${postId}`;

    const isRejected = Boolean(reason && reason.trim());
    const subject = isRejected
      ? `Your Success Story Submission was Rejected by Dr. ${doctorName}`
      : `Your Success Story has been Verified by Dr. ${doctorName}`;

    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Success Story Verification Details</h2>
        <p>Dear User,</p>
        <p>Your success story has been reviewed by Dr. <strong>${doctorName}</strong>.</p>
        ${
          isRejected
            ? `<p style="color: red;"><strong>We regret to inform you that your Success Story has been marked invalid due to the below reason.Consider verifying your post details before posting .</strong></p>
               <p><strong>Reason:</strong> ${reason}</p>`
            : `<p style="color: green;"><strong>Good news! Your success story has been verified.</strong></p>`
        }
        <p>You can view or edit the post by clicking the link below:</p>
        <a href="${postLink}" style="color: #2e7d32;">${postLink}</a>
        <br /><br />
        <p>Regards,<br /> Team ArogyaPath </p>
      </div>
    `;

    await sendEmail(receiverEmail, subject, emailBody);
    return true;
  } catch (error) {
    throw new ExpressError(500, "Error sending email to the user. Try Again!");
  }
};
