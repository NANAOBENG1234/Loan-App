import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { updateProfile, changePassword } from "../controllers/user.controller";

const router = Router();

router.put("/profile", authenticate, updateProfile);
router.put("/password", authenticate, changePassword);

export default router;
