import { config as dotEnvConfig } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotEnvConfig();
 }
 
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "arogyaPath_DEV",
    allowedFormats: ["png", "jpg", "jpeg", "mp4", "pdf"],
  } ,
});