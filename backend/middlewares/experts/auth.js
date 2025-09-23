import ExpressError from "../../utils/expressError.js";

export const checkExpertLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new ExpressError(401,"Authentication required");
  }
  if (req.user.role !== "expert") {
    throw new ExpressError( 403,"Expert authorization required");
  }
  next();
};

