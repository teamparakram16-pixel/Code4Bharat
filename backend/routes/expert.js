import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  isAlreadyVerified,
  isLoggedIn,
  profileAlreadyCompleted,
} from "../middlewares/commonAuth.js";
import { checkExpertLogin } from "../middlewares/experts/auth.js";
import { validateExpertCompleteProfile } from "../middlewares/validationMiddleware/validationMiddlewares.js";
import expertProfileController from "../controllers/expert.js";

import { validateExpertDocuments } from "../middlewares/experts/validateExpertDocument.js";
import { parseFormdata } from "../middlewares/cloudinaryMiddleware.js";
import { handleExpertDocumentDiskUpload } from "../middlewares/cloudinary/handleExpertDocument/handleExpertDocumentsDiskUpload.js";
import { handleExpertDocumentUpload } from "../middlewares/cloudinary/handleExpertDocument/handleExpertDocumentUpload.js";
import {validateObjectId} from "../middlewares/objectId.js";
import { checkUserLogin } from "../middlewares/users/auth.js";



const router = express.Router();

// ========== ACTIVE ROUTES ==========

// PATCH: Complete doctor profile
router.patch(
  "/complete-profile",
  checkExpertLogin,
  profileAlreadyCompleted,
  // Handle file uploads with multer
   handleExpertDocumentDiskUpload,
  // Validate required documents are present
  validateExpertDocuments,
  parseFormdata,
  // Validate the request body
  validateExpertCompleteProfile,
  // Upload documents to Cloudinary
  wrapAsync(handleExpertDocumentUpload),
  // Complete the profile
  wrapAsync(expertProfileController.completeProfile)
);


// Patch Update Expert Profile
router.patch("/update-profile",checkExpertLogin,isAlreadyVerified,wrapAsync(expertProfileController.updateProfile))

// Post : To send user the message regarding the success story update
router.post("/successstories-status",checkExpertLogin,wrapAsync(expertProfileController.sendsstorystatus))

// Ptch Update Expert Password
router.patch("/change-password",checkExpertLogin,isAlreadyVerified,wrapAsync(expertProfileController.changePassword))

// Get : To display profile of the expert
router.get('/expert-profile', checkExpertLogin, wrapAsync(expertProfileController.getExpertProfile));

// GET: Search doctors
router.get(
  "/search/doctors",
  isLoggedIn,
  isAlreadyVerified,
  wrapAsync(expertProfileController.searchDoctors)
);

router.get("/doctors",isLoggedIn,isAlreadyVerified,wrapAsync(expertProfileController.getAllDoctors));


router.get("/profile", checkExpertLogin, wrapAsync(expertProfileController.getExpertProfile));

router.get("/:id/posts",wrapAsync(expertProfileController.getExpertPosts));

router.get("/myposts",checkExpertLogin, wrapAsync(expertProfileController.getExpertPosts));


// PUT: Edit expert basic info
router.put("/edit/:id",validateObjectId, wrapAsync(expertProfileController.editExpert));

// POST : Establish Connection between user and expert
router.post("/:expertId/chats",checkUserLogin,wrapAsync(expertProfileController.establishusertoexpertchat));


// Post : Add Expert Post Bookmarks
router.post('/bookmarks/:postId',checkExpertLogin,wrapAsync(expertProfileController.addBookmarks))

// Delete : Remove Expert Post Bookmarks
router.delete('/bookmarks/:postId',checkExpertLogin,wrapAsync(expertProfileController.removeBookmarks))



// ========== COMMENTED ROUTES (AS-IS) ==========

// // Get all experts
// router.get(
//   "/",
//   wrapAsync(async (req, res) => {
//     const experts = await Expert.find().populate("posts");
//     res.status(200).json(experts);
//   })
// );


// // Get an expert by ID
// router.get(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     const expert = await Expert.findById(req.params.id);
//     if (!expert) return res.status(404).json({ error: "Expert not found" });

//     res.status(200).json(expert);
//   })
// );

// // Delete an expert by ID
// router.delete(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     const expert = await Expert.findByIdAndDelete(req.params.id);
//     if (!expert) return res.status(404).json({ error: "Expert not found" });

//     res.status(200).json({ message: "Expert deleted" });
//   })
// );

// // Update an expert by ID
// router.put(
//   "/:id",
//   // validateExpert,
//   wrapAsync(async (req, res) => {
//     const updatedExpert = await Expert.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedExpert)
//       return res.status(404).json({ error: "Expert not found" });

//     res.status(200).json({ message: "Expert updated", expert: updatedExpert });
//   })
// );
// Get : All Expert Post Bookmarks
router.get("/bookmarks",checkExpertLogin ,wrapAsync(expertProfileController.getBookmarks));

// GET: Get expert by ID — 
router.get("/:id",validateObjectId ,wrapAsync(expertProfileController.getExpertById));




export default router;
