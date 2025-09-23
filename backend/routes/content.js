import express from 'express';
import Content from '../models/Content.js';
import HealthChallenge from '../models/HealthChallenge.js';
import wrapAsync from '../utils/wrapAsync.js';

const router = express.Router();

// Upload Content
router.post('/:challengeId/content', wrapAsync(async (req, res) => {
    const { challengeId } = req.params;
    const { video, heading, description, date} = req.body;

    const content = new Content({ video, heading, description, date, healthChallenge: challengeId });
    content.owner=req.user;
    await content.save();
    await HealthChallenge.findByIdAndUpdate(challengeId, { $push: { content: content._id } });
    res.status(201).json({ message: 'Content added successfully', content });
}));

export default router;
