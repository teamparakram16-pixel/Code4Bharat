import { sendContactUsEmailUtil } from "../utils/sendContactUsEmail.js";
import ExpressError from "../utils/expressError.js";

// Controller to handle Contact Us form submissions
const sendContactUsEmail = async (req, res, next) => {
  try {
    const { fullName, email, message, subject } = req.body;
    const emailSubject = `Contact Us Form Submission from ${fullName} : ${subject}`;
    const html = `<p><strong>Name:</strong> ${fullName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`;
    await sendContactUsEmailUtil(
      process.env.CONTACT_US_EMAIL || "teamparakram16@gmail.com",
      emailSubject,
      html
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Your message has been sent successfully.",
      });
  } catch (error) {
    console.error("Error sending contact us email:", error);
    throw new ExpressError(
      500,
      "Failed to send message. Please try again later."
    );
  }
};

export default sendContactUsEmail;
