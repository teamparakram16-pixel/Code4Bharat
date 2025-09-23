import express from "express";
import Like from "../models/Like/Like.js"; // Import Like model
import wrapAsync from "../utils/wrapAsync.js"; // Import wrapAsync function

const router = express.Router();
router.post("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const owner = req.user._id;
    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const newLike = new Like({ owner, post: id });
    await newLike.save(); 
    res.status(201).json(newLike); 
  }));

  router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params; 
    const owner = req.user._id;
    const like = await Like.findOne({ _id: id, owner });
    if (!like) {
      return res.status(404).json({ error: "Like not found or not authorized to delete" });
    }
    await Like.findByIdAndDelete(id);  
    res.status(200).json({ message: "Like deleted successfully" });
  }));

export default router;