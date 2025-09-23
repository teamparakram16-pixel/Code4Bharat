import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userType: {
    type: String,
    required: true,
    enum: ["User", "Expert"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    refPath: "userType",
    required: true,
  },

  token: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 3600 * 1000),
  },
});

// TTL index
tokenSchema.index({ expiration: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model("token", tokenSchema);

export default Token;
