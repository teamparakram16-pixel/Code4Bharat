// import express from 'express';
// import HealthChallenge from "../models/HealthChallenge/HealthChallenge.js";
// import wrapAsync from '../utils/wrapAsync.js';

// const router = express.Router();

// // Create Health Challenge
// router.post('/create', wrapAsync(async (req, res) => {
//     const { title, description } = req.body;
//     const thumbnail=req.file;
//     const challenge = new HealthChallenge({ title, description, thumbnail });
//     challenge.owner=req.user;
//     await challenge.save();
//     res.status(201).json({ message: 'Health Challenge created successfully', challenge });
// }));

// // Delete Health Challenge
// router.delete('/:id', wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await HealthChallenge.findByIdAndDelete(id);
//     res.status(200).json({ message: 'Health Challenge deleted successfully' });
// }));

// export default router;
