import { Router } from "express";
import { register, login, logout, getProfile } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/profile", authenticate, getProfile);

export default router;
