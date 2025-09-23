import { config } from "dotenv";
config();
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize once
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Export the model instance (you can export multiple if needed)
export const geminiFlashModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});
// export const geminiProModel = genAI.getGenerativeModel({ model: "gemini-pro" });
