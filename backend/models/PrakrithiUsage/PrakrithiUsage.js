import mongoose from "mongoose";

const prakritiUsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  analysis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prakrithi",
    default: null, // optional to store which analysis it related to
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // for efficient date range queries
  },
},{timestamps: true});

// Compound index for user and analysis (prakrithiId)
prakritiUsageSchema.index({ user: 1, analysis: 1 });

// You can add compound index if frequent combined queries needed
prakritiUsageSchema.index({ user: 1, createdAt: 1 });

const PrakritiUsage = mongoose.model("PrakritiUsage", prakritiUsageSchema);
export default PrakritiUsage;
