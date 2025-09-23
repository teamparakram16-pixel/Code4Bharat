import mongoose from "mongoose";

const isValidObjectId = (userId) => {
  return mongoose.Types.ObjectId.isValid(userId);
};

export default isValidObjectId;
