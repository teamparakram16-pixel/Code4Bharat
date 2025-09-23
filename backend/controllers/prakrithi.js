import axios from "axios";
import Prakrithi from "../models/Prakrathi/Prakrathi.js";
import ExpressError from "../utils/expressError.js";
import { sendPdfReport } from "../utils/sendPdfReport.js";
import calculateSimilarPrakrithiUsers from "../utils/similarPkUsers.js";
import PrakritiUsage from "../models/PrakrithiUsage/PrakrithiUsage.js";
import getActivePremiumFeature from "../utils/getActivePremiumFeature.js";
import User from "../models/User/User.js";
import isValidObjectId from "../utils/isValidObjectId.js";

export const getPrakritiStatus = async (req, res, next) => {
  const user = req.user;
  const now = new Date();

  if (!isValidObjectId(user._id)) {
    throw new ExpressError("Invalid or missing user.", 400);
  }

  const userId = user._id;


  if (user.prakritiAnalysis && user.prakritiAnalysis.analysisRef) {
    // Populate prakritiAnalysis.analysisRef within this user instance
    await user.populate("prakritiAnalysis.analysisRef");
  }


  const existingPrakriti = user.prakritiAnalysis.analysisRef;



  // Get active premium feature for the user
  const activePremium = getActivePremiumFeature(user);
  const premiumNo = activePremium ? activePremium.premiumNo : null;
  const validTill = activePremium ? activePremium.validTill : null;

  // Support PremiumOption durationDays
  const durationDays = activePremium?.premiumOption?.durationDays ?? 30;

  const premiumStartDate =
    activePremium && activePremium.validTill
      ? new Date(
        activePremium.validTill.getTime() - durationDays * 24 * 60 * 60 * 1000
      )
      : null;

  // Count how many Prakriti analyses done today
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const pkDoneToday = await PrakritiUsage.countDocuments({
    user: userId,
    createdAt: { $gte: todayStart, $lt: tomorrowStart },
  });

  // Count how many Prakriti analyses done in the current premium period (or month fallback)
  const periodStart =
    premiumStartDate || new Date(now.getFullYear(), now.getMonth(), 1); // fallback: start of current month

  const pkDoneMonthly = await PrakritiUsage.countDocuments({
    user: userId,
    createdAt: { $gte: periodStart, $lte: now },
  });

  // Define the PREMIUM_LIMITS here
  const PREMIUM_LIMITS = {
    1: { maxInPeriod: 20, maxPerDay: 2 },
    2: { maxInPeriod: 30, maxPerDay: 4 },
    3: { maxInPeriod: 30, maxPerDay: 30 },
  };

  // For free users (no premiumNo)
  const isPremium = premiumNo && premiumNo in PREMIUM_LIMITS;

  // Use limits or free tier assumptions
  const limits = isPremium
    ? PREMIUM_LIMITS[premiumNo]
    : { maxInPeriod: 1, maxPerDay: 1 }; // Free tier allows only 1 usage ever & 1 per day

  // Calculate how many analyses left for today and period
  const leftPkToday = Math.max(limits.maxPerDay - pkDoneToday, 0);
  const leftPkThisMonth = Math.max(limits.maxInPeriod - pkDoneMonthly, 0);

  // Can the user do a new Prakriti analysis now?
  // True if both daily and monthly limits allow
  const canDoPrakrithi = leftPkToday > 0 && leftPkThisMonth > 0;

  const response = {
    canDoPk: {
      pkDoneToday,
      pkDoneMonthly,
      canDoPrakrithi,
      leftPkToday,
      leftPkThisMonth,
    },
    premium: {
      premiumNo: premiumNo || null,
      validTill: validTill || null,
    },
    prakritiAnalysisExists: !!existingPrakriti,
    prakritiAnalysis: existingPrakriti || null,
  };

  return res.status(201).json({ success: true, data: response });
};

const findPrakrithi = async (req, res) => {
  const inputData = req.body;
  const userId = req.user?._id;
  const user = req.user;

  // Decide API key based on premiumUser flag (adjust logic as needed)
  const activePremium = getActivePremiumFeature(user);
  // Suppose you want to distinguish by tier (example: premiumNo 1 = "basic", 2/3 = "pro")
  let apiKey;
  if (!activePremium) {
    // No premium - free tier
    apiKey = process.env.PRAKRITHI_FREE_API_KEY;
  } else if (activePremium.premiumNo === 1) {
    // Basic premium
    apiKey = process.env.PRAKRITHI_FREE_API_KEY;
  } else if (activePremium.premiumNo === 2 || activePremium.premiumNo === 3) {
    // Pro/Standard premium
    apiKey = process.env.PRAKRITHI_PREMIUM_API_KEY;
  } else {
    // Default/fallback: treat as free
    apiKey = process.env.PRAKRITHI_FREE_API_KEY;
  }


  const { data: result } = await axios.post(process.env.PRAKRITHI_MODEL, {
    ApiKey: apiKey,
    ApiKey: apiKey,
    ...inputData,
  });


  const prakritiData = {
    ...inputData,
    Dominant_Prakrithi: result.Dominant_Prakrithi,
    Body_Constituents: result.Body_Constituents,
    Recommendations: result.Recommendations,
    Potential_Health_Concerns: result.Potential_Health_Concerns,
    user: req.user._id,
  };

  // Upsert: update if exists, else create new
  const updatedPrakriti = await Prakrithi.findOneAndUpdate(
    { user: userId },
    prakritiData,
    { new: true, upsert: true, runValidators: true }
  );

  
  // Update the User document to keep reference to latest PrakritiAnalysis
  await User.findByIdAndUpdate(userId, {
    prakritiAnalysis: {
      analysisRef: updatedPrakriti._id,
      lastAnalyzedAt: updatedPrakriti.updatedAt || new Date(),
    },
  });

  // Create a PrakritiUsage document to track this usage
  await PrakritiUsage.create({
    user: userId,
    analysis: updatedPrakriti._id,
  });

  // Return the saved/upserted PrakritiAnalysis document
  res.status(201).json({ success: true, data: updatedPrakriti });

};

const findSimilarPrakrithiUsers = async (req, res) => {
  const userId = req.user._id;
  const currentUserEntry = await Prakrithi.findOne({ user: userId }).populate(
    "user"
  );
  if (!currentUserEntry) {
    throw new ExpressError(404, "Prakrithi data not found for this user.");
  }
  const fieldsToCompare = [
    "Body_Type",
    "Skin_Type",
    "Hair_Type",
    "Facial_Structure",
    "Complexion",
    "Eyes",
    "Food_Preference",
    "Bowel_Movement",
    "Thirst_Level",
    "Sleep_Quality",
    "Energy_Levels",
    "Daily_Activity_Level",
    "Exercise_Routine",
    "Food_Habit",
    "Water_Intake",
    "Health_Issues",
    "Hormonal_Imbalance",
    "Skin_Hair_Problems",
    "Ayurvedic_Treatment",
  ];

  const otherUsers = await Prakrithi.find({
    user: { $ne: userId },
    Dominant_Prakrithi: currentUserEntry.Dominant_Prakrithi,
  }).populate("user");
  const similarUsers = calculateSimilarPrakrithiUsers(
    currentUserEntry,
    otherUsers,
    fieldsToCompare
  );
  res.status(200).json({
    success: true,
    message: "Similar users data",
    similarUsers,
  });
};

const sendPkPdfToMail = async (req, res) => {
  if (!req.file) {
    throw new ExpressError("PDF file is required", 400);
  }

  const pdfBuffer = req.file.buffer;

  try {
    await sendPdfReport(req.user?.email, pdfBuffer, req.user?.profile.fullName);

    res.status(200).json({
      success: true,
      message: "PDF sent and analysis completed",
    });
  } catch (err) {
    console.error("Error sending PDF email:", err.message);

    throw new ExpressError("Failed to send PDF report via email", 500);
  }
};

export default {
  findPrakrithi,
  findSimilarPrakrithiUsers,
  sendPkPdfToMail,
};
