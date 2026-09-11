import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { updateProfile, changePassword, deleteAccount } from "../controllers/user.controller";

const router = Router();

router.put("/profile", authenticate, updateProfile);
router.put("/password", authenticate, changePassword);
router.delete("/account", authenticate, deleteAccount);

export default router;
