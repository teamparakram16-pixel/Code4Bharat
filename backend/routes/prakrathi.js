import express from "express";
import { validatePrakrathi } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import wrapAsync from "../utils/wrapAsync.js";
import { checkUserLogin } from "../middlewares/users/auth.js";
import prakrithiAnalysisController, {
  getPrakritiStatus,
} from "../controllers/prakrithi.js";
import multer from "multer";
import { populateUserWithPremium } from "../middlewares/premium/populateUserWithPremium.js";
import { checkPrakritiPremium } from "../middlewares/premium/checkPrakritiPremium.js";
import { checkSimilarPrakrithiPremium } from "../middlewares/premium/checkSimilarPkPremium.js";
// Configure multer for single PDF upload
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Allow only one file
  },
});

const router = express.Router();

router.get("/", checkUserLogin, wrapAsync(getPrakritiStatus));

router.post(
  "/",
  checkUserLogin,
  wrapAsync(populateUserWithPremium),
  wrapAsync(checkPrakritiPremium),
  validatePrakrathi,
  wrapAsync(prakrithiAnalysisController.findPrakrithi)
);

router.get(
  "/similar_users",
  checkUserLogin,
  checkSimilarPrakrithiPremium,
  wrapAsync(prakrithiAnalysisController.findSimilarPrakrithiUsers)
);

router.post(
  "/email/pdf",
  checkUserLogin,
  memoryUpload.single("pdf"),
  wrapAsync(prakrithiAnalysisController.sendPkPdfToMail)
);

export default router;
