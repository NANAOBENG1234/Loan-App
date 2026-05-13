import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { applyForLoan, getMyLoans, getCurrentLoan, getLoanDetails } from "../controllers/loan.controller";

const router = Router();

router.post("/apply", authenticate, applyForLoan);
router.get("/", authenticate, getMyLoans);
router.get("/current", authenticate, getCurrentLoan);
router.get("/:id", authenticate, getLoanDetails);

export default router;
