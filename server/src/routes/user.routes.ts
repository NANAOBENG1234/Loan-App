import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { updateProfile, changePassword, deleteAccount, getMyVerifications } from "../controllers/user.controller";

const router = Router();

router.put("/profile", authenticate, updateProfile);
router.put("/password", authenticate, changePassword);
router.delete("/account", authenticate, deleteAccount);
router.get("/verifications", authenticate, getMyVerifications);

export default router;
