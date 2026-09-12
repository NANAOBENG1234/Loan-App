import { Router } from "express";
import { register, login, logout, getProfile } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authIpLimiter, loginLimiter, registerLimiter } from "../middleware/authLimiter";

const router = Router();

router.post("/register", authIpLimiter, registerLimiter, register);
router.post("/login", authIpLimiter, loginLimiter, login);
router.post("/logout", logout);
router.get("/profile", authenticate, getProfile);

export default router;
