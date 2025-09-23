import Payment from "../models/Payment/Payment.js";
import PremiumOption from "../models/PremiumOption/premiumOption.js";
import User from "../models/User/User.js";
import ExpressError from "../utils/expressError.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../utils/razorpayUtils.js";

export const getAllPremiumOptions = async (req, res) => {
  const applicableTo = req.user.role;
  const premiumOptions = await PremiumOption.find({ applicableTo }).sort({
    displayOrder: 1,
  }); // Sort by displayOrder for UI

  const userPlan = req.user.premiumFeature?.premiumOption;

  res.status(200).json({
    success: true,
    data: premiumOptions,
    userPlan: userPlan || null,
  });
};

export const createPremiumOrder = async (req, res) => {
  const userId = req.user._id;
  const premiumOptionId = req.params.id;

  // Fetch premium plan
  const premium = await PremiumOption.findById(premiumOptionId);
  if (!premium) {
    throw new ExpressError(404, "Premium plan not found.");
  }

  // Prepare Razorpay order details
  const amount = premium.price; // price stored in paise
  const receipt = `prem${premium.premiumNo}_${userId
    .toString()
    .slice(-8)}_${Date.now()}`;

  // Create order with Razorpay
  const order = await createRazorpayOrder(amount, "INR", receipt);

  // Respond with order details needed for payment page
  res.status(201).json({
    success: true,
    order,
    premium: {
      id: premium._id,
      name: premium.name,
      price: premium.price,
      durationDays: premium.durationDays,
      features: premium.features,
    },
  });
};

// Controller to verify Razorpay payment for premium
export const verifyPremiumPayment = async (req, res) => {
  const userId = req.user._id;
  const userType = req.user.role === "user" ? "User" : "Expert";
  const premiumOptionId = req.params.id;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    // (optionally more payment info from req.body)
  } = req.body;

  // Step 1: Validate payment signature
  const isValid = verifyRazorpayPayment(
    { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    process.env.RAZORPAY_KEY_SECRET
  );
  if (!isValid) {
    throw new ExpressError(400, "Payment signature verification failed.");
  }

  // Step 2: Load premium plan
  const premium = await PremiumOption.findById(premiumOptionId);
  if (!premium) {
    throw new ExpressError(404, "Premium plan not found.");
  }

  // Step 3: Calculate validity
  const now = new Date();
  const validTill = new Date(
    now.getTime() + premium.durationDays * 24 * 60 * 60 * 1000
  );

  // Step 4: Create Payment record
  const payment = await Payment.create({
    userType: userType, // adjust as needed if Experts are supported
    userId,
    paymentId: razorpay_payment_id,
    amount: premium.price,
    paymentDate: now,
    paymentType: "premiumFeature",
    premium: {
      id: premium._id,
      premiumNo: premium.premiumNo,
      validTill,
    },
    status: "completed",
  });

  // Step 5: Update (or push to) user's premiumFeature
  const update = {
    premiumFeature: {
      premiumOption: premium._id,
      premiumNo: premium.premiumNo,
      validTill,
      paymentId: payment._id,
    },
  };
  // If you support multiple premiums, use $push to premiumFeatures array
  const data = await User.findByIdAndUpdate(userId, update, { new: true });

  res.status(200).json({
    success: true,
    message: "Premium activated!",
    premium: { ...update.premiumFeature, features: premium.features },
  });
};
