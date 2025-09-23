import ExpressError from "./expressError.js";
import { razorpayInstance } from "../razorpayConfig.js";
import crypto from "crypto";

/**
 * Utility to create a Razorpay order.
 * @param {number} amount - Amount in INR (not paise).
 * @param {string} currency - Currency code, e.g., "INR".
 * @param {string} [receipt="order_rcptid_11"] - Receipt identifier.
 * @returns {Promise<object>} - The created order object.
 */
export const createRazorpayOrder = async (
  amount,
  currency = "INR",
  receipt = "order_rcptid_11"
) => {
  const options = {
    amount: amount, 
    currency,
    receipt,
  };
  const order = await razorpayInstance.orders.create(options);
  if (!order) {
    throw new ExpressError(500, "Error creating order with Razorpay");
  }
  return order;
};

/**
 * Utility to verify Razorpay payment signature.
 * @param {object} params - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @param {string} secret - Your Razorpay key secret.
 * @returns {boolean} - True if signature is valid, else false.
 */
export const verifyRazorpayPayment = (params, secret) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;
  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
    


  return generated_signature === razorpay_signature;
};
