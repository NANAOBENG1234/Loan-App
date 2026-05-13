import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { updateProfile, updateSettings } from "../controllers/user.controller";

const router = Router();

router.put("/profile", authenticate, updateProfile);
router.put("/settings", authenticate, updateSettings);

export default router;
