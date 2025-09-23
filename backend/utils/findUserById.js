import Expert from "../models/Expert/Expert.js";
import User from "../models/User/User.js";
import ExpressError from "./expressError.js";

// Find user or expert by ID
const findUserById = async (id, userType) => {
  const Model = userType === "Expert" ? Expert : User;
  const user = await Model.findById(id);

  return user;
};

export default findUserById;
