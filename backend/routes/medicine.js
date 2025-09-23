import { Router } from "express"
import { getAllMedicines, getMedicineById } from "../controllers/medicine.js";
import medicineUploader from "../utils/cloudinary/uploadConfigs/medicineUploadImage.js";
import { createMedicine } from "../controllers/medicine.js";
import { updateMedicineText } from "../controllers/medicine.js";
import { deleteMedicine } from "../controllers/medicine.js";
const router = new Router()

router.get("/", getAllMedicines);     
router.get("/:id", getMedicineById);
router.post("/", medicineUploader, createMedicine);
router.patch("/:id", updateMedicineText);
router.delete("/:id", deleteMedicine);
export default router;
