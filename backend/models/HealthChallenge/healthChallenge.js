import mongoose from 'mongoose';
const { Schema } = mongoose;

const healthChallengeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    content: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }]
}, { timestamps: true });

const HealthChallenge = mongoose.model('HealthChallenge', healthChallengeSchema);

export default HealthChallenge;
