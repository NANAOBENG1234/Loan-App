import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import { PaymentService } from "../services/payment.service";
import { repaymentSchema } from "../utils/validators";
import { MOMO_DETAILS } from "../constants/payment";
import { getPaymentProvider } from "../services/payments";
import { HttpError } from "../utils/HttpError";

const paymentService = new PaymentService();

export async function initiatePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { loanId, amount, method } = repaymentSchema.parse(req.body);
    const result = await paymentService.recordRepayment(loanId, req.user!.id, amount, method);

    res.json({
      message:
        result.checkout.verified && result.checkout.confirmed
          ? "Payment confirmed."
          : "Payment initiated.",
      repayment: result.repayment,
      checkout: result.checkout,
      paymentDetails: MOMO_DETAILS,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentMethods(req: Request, res: Response, next: NextFunction) {
  try {
    const provider = getPaymentProvider();
    res.json({
      gateway: provider.name,
      live: provider.name !== "mock",
      methods: MOMO_DETAILS,
    });
  } catch (error) {
    next(error);
  }
}

/** Raw-body webhook receiver; verified against the active provider. */
export async function handleWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body), "utf8");
    const result = await paymentService.handleGatewayWebhook(req.headers as Record<string, unknown>, rawBody);
    res.json(result);
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
    if (!loan) throw new HttpError(404, "Loan not found");

    const repayments = await prisma.repayment.findMany({
      where: { loanId: req.params.loanId },
      orderBy: { dueDate: "asc" },
    });
    res.json(repayments);
  } catch (error) {
    next(error);
  }
}