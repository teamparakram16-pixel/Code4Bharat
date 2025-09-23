import mongoose from 'mongoose';
const { Schema } = mongoose;

const contentSchema = new Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
    healthChallenge: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthChallenge', required: true }
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);
