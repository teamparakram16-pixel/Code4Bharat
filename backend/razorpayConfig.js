import { config as dotEnvConfig } from "dotenv";
import e from "express";
if (process.env.NODE_ENV !== "production") {
  dotEnvConfig();
}

import Razorpay from "razorpay";
const createRazorPayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export const razorpayInstance = createRazorPayInstance();
