import ExpressError from "../../utils/expressError.js";
import { parseZodError } from "../../utils/parseZodError.js";
import validationSchemas, {
  medicalRoutineAppointmentSchema,
  razorpayPaymentSchema,
} from "./validationSchema.js";
const {
  userSchemaZod,
  expertSchemaZod,
  postSchemaZod,
  routineSchemaZod,
  successStorySchemaZod,
  forgotPasswordSchema,
  resetPasswordSchema,
  expertProfileSchema,
  userProfileSchema,
  commentSchemaZod,
  prakrithiSchema,
  usersIdsSchema,
  chatRequestSchemaZod,
  userSignupSchema,
  expertSignupSchema,
  loginSchema,
} = validationSchemas;

export const validateUser = (req, res, next) => {
  const result = userSchemaZod.safeParse(req.body);
  if (!result.success)
    throw new ExpressError(400, parseZodError(result.error.format()));
  req.validatedData = result.data;
  next();
};

export const validateExpert = (req, res, next) => {
  const result = expertSchemaZod.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  req.validatedData = result.data;
  next();
};

export const validatePost = (req, res, next) => {
  const result = postSchemaZod.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validateRoutine = (req, res, next) => {
  const result = routineSchemaZod.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validateSuccessStory = (req, res, next) => {
  if (
    !successStorySchemaZod ||
    typeof successStorySchemaZod.safeParse !== "function"
  ) {
    console.error(
      "validateSuccessStory: successStorySchemaZod is undefined or invalid"
    );
    throw new ExpressError(
      500,
      "Internal server error: successStorySchemaZod is not defined"
    );
  }
  const result = successStorySchemaZod.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validateComment = (req, res, next) => {
  const result = commentSchemaZod.safeParse(req.body);
  if (!result.success) {
    throw new ExpressError(400, parseZodError(result.error));
  }

  req.validatedData = result.data;
  next();
};
export const validatePrakrathi = (req, res, next) => {
  const result = prakrithiSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validateForgotPassword = (req, res, next) => {
  const result = forgotPasswordSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validateResetPassword = (req, res, next) => {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validateExpertCompleteProfile = (req, res, next) => {
  const result = expertProfileSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validateUserCompleteProfile = (req, res, next) => {
  const result = userProfileSchema.safeParse(req.body.userProfile);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validateChatUsersIds = (req, res, next) => {
  const result = usersIdsSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validateChatRequest = (req, res, next) => {
  const result = chatRequestSchemaZod.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  req.validatedData = result.data;
  next();
};

// Auth validation middlewares
export const validateUserSignup = (req, res, next) => {
  const result = userSignupSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  req.validatedData = result.data;
  next();
};

export const validateExpertSignup = (req, res, next) => {
  const result = expertSignupSchema.safeParse(req.body);

  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  req.validatedData = result.data;
  next();
};

export const validateLogin = (req, res, next) => {
  console.log("Validating login data:", req.body);
  const result = loginSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  console.log("Login data is valid:", result.data);
  req.validatedData = result.data;
  next();
};

export const checkChatRequestDoesNotContainCurrentUser = (req, res, next) => {
  const { users } = req.body;
  const currUserId = req.user?._id?.toString();
  if (users && users.some((u) => u.user === currUserId)) {
    throw new ExpressError(400, "Current user cannot be in the users list");
  }
  next();
};

export const validateContactUs = (req, res, next) => {
  const result = contactUsSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validatePaymentBody = (req, res, next) => {
  const result = razorpayPaymentSchema.safeParse(req.body);
  if (!result.success) throw new ExpressError(400, parseZodError(result.error));
  next();
};

export const validateMedicalRoutineAppointment = (req, res, next) => {
  const result = medicalRoutineAppointmentSchema.safeParse(
    req.body.appointmentData
  );
  if (!result.success) {
    throw new ExpressError(400, parseZodError(result.error));
  }
  req.validatedData = result.data;
  next();
};

export default {
  validateUser,
  validateExpert,
  validatePost,
  validateComment,
  validatePrakrathi,
  validateForgotPassword,
  validateResetPassword,
  validateExpertCompleteProfile,
  validateUserCompleteProfile,
  validateChatUsersIds,
  validateChatRequest,
  checkChatRequestDoesNotContainCurrentUser,
  validateContactUs,
  validatePaymentBody,
  validateMedicalRoutineAppointment,
};
