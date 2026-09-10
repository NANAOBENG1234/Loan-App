import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { updateProfile } from "../controllers/user.controller";

const router = Router();

router.put("/profile", authenticate, updateProfile);

export default router;
