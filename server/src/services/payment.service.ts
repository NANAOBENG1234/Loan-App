import { randomUUID } from "crypto";
import prisma from "../config/db";
import { getIO } from "../config/socket";
import { LoanService } from "./loan.service";
import { HttpError } from "../utils/HttpError";
import { getPaymentProvider } from "./payments";
import { logger } from "../utils/logger";

const loanService = new LoanService();

const AMOUNT_TOLERANCE = 0.01;

interface MarkRepaidOptions {
  clearedBy: string;
}

export class PaymentService {
  /** Validates against the stored due amount, creates a gateway checkout and returns it. */
  async recordRepayment(loanId: string, userId: string, amount: number, method?: string) {
    const loan = await prisma.loan.findFirst({
      where: { id: loanId, userId },
      include: { repayments: { where: { status: "pending" }, orderBy: { dueDate: "asc" } } },
    });

    if (!loan) throw new HttpError(404, "Loan not found");
    if (loan.status === "repaid") throw new HttpError(409, "Loan already repaid");

    const pending = loan.repayments[0];
    if (!pending) throw new HttpError(409, "No pending repayments found");

    const due = pending.amount;
    if (Math.abs(amount - due) > AMOUNT_TOLERANCE) {
      throw new HttpError(400, `Payment amount must be exactly GHS ${due.toFixed(2)}`);
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { phone: true } });
    const provider = getPaymentProvider();
    const reference = `PMT-${randomUUID()}`;

    const repayment = await prisma.repayment.update({
      where: { id: pending.id },
      data: {
        method: method || "mobile_money",
        status: "pending",
        reference,
      },
    });

    const checkout = await provider.createPayment({
      reference,
      amount: due,
      currency: "GHS",
      method: method || "mtn",
      phone: user?.phone,
      callbackUrl: process.env.CLIENT_URL || "http://localhost:3000/dashboard/repayments",
    });

    let confirmed = false;
    if (provider.autoVerifyOnInitiate) {
      confirmed = await provider.verifyPayment({ reference, amount: due });
      if (confirmed) {
        const updated = await prisma.repayment.update({
          where: { id: repayment.id },
          data: {
            status: "paid",
            paidAt: new Date(),
            clearedBy: `gateway:${provider.name}`,
            clearedAt: new Date(),
          },
        });
        await this.finalizeLoan(repayment.loanId, repayment.userId);
        return {
          repayment: updated,
          checkout: { provider: provider.name, verified: true, confirmed: true },
        };
      }
    }

    return {
      repayment,
      checkout: {
        provider: provider.name,
        paymentUrl: checkout.paymentUrl,
        instructions: checkout.instructions,
        verified: provider.autoVerifyOnInitiate,
        confirmed,
      },
    };
  }

  /** Admin manual confirmation (fallback when no gateway is configured). */
  async clearRepayment(repaymentId: string, adminId: string) {
    const repayment = await prisma.repayment.findUnique({
      where: { id: repaymentId },
      include: { loan: true },
    });

    if (!repayment) throw new HttpError(404, "Repayment not found");
    if (repayment.status === "paid") throw new HttpError(409, "Already cleared");

    const updated = await prisma.repayment.update({
      where: { id: repaymentId },
      data: {
        status: "paid",
        paidAt: new Date(),
        clearedBy: adminId,
        clearedAt: new Date(),
      },
    });

    await this.finalizeLoan(repayment.loanId, repayment.userId);
    return updated;
  }

  /** Shared completion path: mark loan repaid, upgrade level, notify. */
  private async finalizeLoan(loanId: string, userId: string) {
    await prisma.loan.update({
      where: { id: loanId },
      data: { status: "repaid", repaidAt: new Date() },
    });

    await loanService.upgradeUserLevel(userId);

    const io = getIO();
    io.to(`user:${userId}`).emit("loan:cleared", { loanId });
  }

  /** Gateway webhook entry: signature-verified, idempotent. */
  async handleGatewayWebhook(headers: Record<string, unknown>, rawBody: Buffer) {
    const provider = getPaymentProvider();
    const valid = await provider.verifyWebhookSignature(headers, rawBody);
    if (!valid) throw new HttpError(401, "Invalid webhook signature");

    const event = await provider.parseWebhook(rawBody);
    if (!event.reference) return { received: true, processed: false, reason: "no reference" };

    const repayment = await prisma.repayment.findFirst({
      where: { reference: event.reference },
    });
    if (!repayment) return { received: true, processed: false, reason: "unknown reference" };
    if (repayment.status === "paid") return { received: true, processed: false, reason: "already paid" };

    const successful = String(event.status).toLowerCase().includes("successful");
    const amountMatches =
      event.amount === undefined || Math.abs(event.amount - repayment.amount) <= AMOUNT_TOLERANCE;
    if (!successful || !amountMatches) {
      logger.warn(`Webhook for ${event.reference} not successful/not matching: ${event.status}`);
      return { received: true, processed: false, reason: "unsuccessful or amount mismatch" };
    }

    await prisma.repayment.update({
      where: { id: repayment.id },
      data: {
        status: "paid",
        paidAt: new Date(),
        clearedBy: `gateway:${provider.name}`,
        clearedAt: new Date(),
        reference: repayment.reference,
      },
    });

    await this.finalizeLoan(repayment.loanId, repayment.userId);
    logger.info(`Gateway webhook cleared repayment ${repayment.id} via ${provider.name}`);
    return { received: true, processed: true };
  }

  async getUserRepayments(userId: string) {
    return prisma.repayment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { loan: { select: { amount: true, status: true } } },
    });
  }

  async getAllRepayments() {
    return prisma.repayment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, phone: true } },
        loan: { select: { amount: true } },
      },
    });
  }
}