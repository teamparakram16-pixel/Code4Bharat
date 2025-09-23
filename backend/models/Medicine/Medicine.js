import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                // Product/medicine name
    description: { type: String, required: true },         // Short description
    category: { type: String, required: true },            // e.g. Tablet, Syrup, Oil
    ingredients: [{ type: String }],                       // Ayurvedic ingredients
    benefits: [{ type: String }],                          // Claimed benefits
    usageInstructions: { type: String },                   // Dosage / How to use
    precautions: { type: String },                         // Warnings / Side effects
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expert",  
    }, // Who listed it
    price: { type: Number, required: true },               // Price per unit
    currency: { type: String, default: "INR" },            // Default currency
    stock: { type: Number, default: 0 },                   // Available quantity
    images: [{ type: String }],                            // Image URLs
    tags: [{ type: String }],                              // Search tags
    isVerified: { type: Boolean, default: false }          // Verified by admin/doctor
  },
  { timestamps: true } 
);

export default mongoose.model("Medicine", medicineSchema);
