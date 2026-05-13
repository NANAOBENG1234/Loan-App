import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { initiatePayment, getMyRepayments, getLoanRepayments } from "../controllers/payment.controller";

const router = Router();

router.post("/initiate", authenticate, initiatePayment);
router.get("/", authenticate, getMyRepayments);
router.get("/:loanId", authenticate, getLoanRepayments);

export default router;
