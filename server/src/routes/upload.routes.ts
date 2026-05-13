import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { uploadVerificationImage } from "../controllers/upload.controller";

const router = Router();

router.post("/verify", authenticate, upload.single("image"), uploadVerificationImage);

export default router;
