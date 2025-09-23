import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["User", "Expert"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    paymentMethod: {
      type: String, // e.g., 'card', 'netbanking', 'upi', 'wallet'
    },
    methodDetails: {
      type: mongoose.Schema.Types.Mixed, // Flexible for any method-specific data
    },
    email: {
      type: String,
    },
    contact: {
      type: String,
    },
    status: {
      type: String, // e.g., 'captured', 'failed'
    },

    // Raw Razorpay payment object (optional, for auditing)
    rawGatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentId: {
      type: String,
      required: true, 
      unique: true, 
      index: true,
    },
    premium: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PremiumOption",
        required: true,
      },
      premiumNo: { type: Number, required: true },
      validTill: { type: Date, required: true },
    },
    paymentType: {
      type: String,
      enum: ["premiumFeature"],
      default: "premiumFeature",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
