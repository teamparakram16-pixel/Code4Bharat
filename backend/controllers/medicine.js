import Medicine from "../models/Medicine/Medicine.js";
import wrapAsync from "../utils/wrapAsync.js";


export const getAllMedicines = wrapAsync(async (req, res) => {
  const medicines = await Medicine.find().sort({ createdAt: -1 });
  res.status(200).json(medicines);
});


export const getMedicineById = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const medicine = await Medicine.findById(id);
  if (!medicine) {
    return res.status(404).json({ message: "Medicine not found" });
  }
  res.status(200).json(medicine);
});

// Create a new medicine with uploaded images
export const createMedicine = wrapAsync(async (req, res) => {
  const {
    name,
    description,
    category,
    ingredients,
    benefits,
    usageInstructions,
    precautions,
    price,
    currency,
    stock,
    tags,
  } = req.body;

  // Get uploaded image paths from multer
  const images = (req.files?.images || []).map(file => file.path);

  // Create new Medicine document
  const newMedicine = new Medicine({
    name,
    description,
    category,
    ingredients: ingredients ? ingredients.split(",") : [],
    benefits: benefits ? benefits.split(",") : [],
    usageInstructions,
    precautions,
    price,
    currency,
    stock,
    tags: tags ? tags.split(",") : [],
    images,             // save the local paths
    sellerId: req.user._id , 
  });

  await newMedicine.save();

  res.status(201).json({
    status: "success",
    message: "Medicine created successfully",
    data: newMedicine,
  });
});


export const updateMedicineText = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const updatedMedicine = await Medicine.findByIdAndUpdate(id, { $set: req.body }, { new: true });

  if (!updatedMedicine)
    return res.status(404).json({ status: "fail", message: "Medicine not found" });

  res.status(200).json({
    status: "success",
    message: "Medicine updated successfully",
    data: updatedMedicine,
  });
});

import fs from "fs";
import path from "path";

export const deleteMedicine = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const medicine = await Medicine.findById(id);
  if (!medicine)
    return res.status(404).json({ status: "fail", message: "Medicine not found" });

  // Delete images from disk
  if (medicine.images && medicine.images.length) {
    medicine.images.forEach((filePath) => {
      const absolutePath = path.join(process.cwd(), filePath);
      fs.unlink(absolutePath, (err) => {
        if (err) console.warn(`Failed to delete file: ${absolutePath}`, err);
      });
    });
  }

  // Delete medicine document from DB
  await Medicine.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Medicine deleted successfully",
  });
});




