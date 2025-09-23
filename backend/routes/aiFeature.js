import express from "express";
import aiFeatureController from "../controllers/aiFeature.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";

const router = express.Router();

router.get("/search", isLoggedIn, aiFeatureController.aiQuerySearch);

export default router;
