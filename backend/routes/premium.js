import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  createPremiumOrder,
  getAllPremiumOptions,
  verifyPremiumPayment,
} from "../controllers/premium.js";
import { validatePaymentBody } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import checkAlreadyPremiumUser from "../middlewares/premium/checkAlreadyPremium.js";
import { checkUserLogin } from "../middlewares/users/auth.js";

const router = express.Router();

router.get("/", checkUserLogin, wrapAsync(getAllPremiumOptions));

router.post(
  "/:id/buy",
  checkUserLogin,
  checkAlreadyPremiumUser,
  wrapAsync(createPremiumOrder)
);

router.post(
  "/:id/payment-confirm",
  checkUserLogin,
  checkAlreadyPremiumUser,
  validatePaymentBody,
  wrapAsync(verifyPremiumPayment)
);

export default router;
