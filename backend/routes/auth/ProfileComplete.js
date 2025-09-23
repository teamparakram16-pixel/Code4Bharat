import express from "express";
import User from "../models/User/User.js";
import { validateUser } from "../middlewares/routemiddlewares.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

// Get user details
router.get(
  "/:userId",
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  })
);

// Update user details
router.put(
  "/:userId",
  validateUser,
  wrapAsync(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  })
);

// Delete user
router.delete(
  "/:userId",
  wrapAsync(async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile deleted" });
  })
);

module.exports = router;
