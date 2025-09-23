import mongoose from "mongoose";

const premiumOptionSchema = new mongoose.Schema(
  {
    premiumNo: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    features: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 0,
    },
    applicableTo: {
      type: [String],
      enum: ["user", "expert"],
      required: true,
    },
  },
  { timestamps: true }
);

const PremiumOption = mongoose.model("PremiumOption", premiumOptionSchema);

export default PremiumOption;
