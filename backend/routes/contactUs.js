import express from "express";
import sendContactUsEmail from "../controllers/contactUsController.js";
import wrapAsync from "../utils/wrapAsync.js";
import { validateContactUs } from "../middlewares/validationMiddleware/validationMiddlewares.js";

const router = express.Router();

// POST /api/contact
router.post("/us", validateContactUs, wrapAsync(sendContactUsEmail));

export default router;
