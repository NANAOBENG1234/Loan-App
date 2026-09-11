import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import { PaymentService } from "../services/payment.service";
import { MOMO_DETAILS } from "../constants/payment";

const paymentService = new PaymentService();

export async function initiatePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { loanId, amount, method } = req.body;
    const result = await paymentService.recordRepayment(loanId, req.user!.id, amount, method);

    res.json({
      message: "Payment recorded. Awaiting admin confirmation.",
      repayment: result,
      paymentDetails: MOMO_DETAILS,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyRepayments(req: Request, res: Response, next: NextFunction) {
  try {
    const repayments = await paymentService.getUserRepayments(req.user!.id);
    res.json(repayments);
  } catch (error) {
    next(error);
  }
}

export async function getLoanRepayments(req: Request, res: Response, next: NextFunction) {
  try {
    const loan = await prisma.loan.findFirst({
      where: { id: req.params.loanId, userId: req.user!.id },
    });
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const repayments = await prisma.repayment.findMany({
      where: { loanId: req.params.loanId },
      orderBy: { dueDate: "asc" },
    });
    res.json(repayments);
  } catch (error) {
    next(error);
  }
}
