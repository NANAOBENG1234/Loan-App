import prisma from "../config/db";
import { getIO } from "../config/socket";
import { LoanService } from "./loan.service";
import { HttpError } from "../utils/HttpError";

const loanService = new LoanService();

const AMOUNT_TOLERANCE = 0.01;

export class PaymentService {
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

    const repayment = await prisma.repayment.update({
      where: { id: pending.id },
      data: {
        method: method || "mobile_money",
        status: "pending",
        reference: `MM-${Date.now()}`,
      },
    });

    return repayment;
  }

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

    await prisma.loan.update({
      where: { id: repayment.loanId },
      data: { status: "repaid", repaidAt: new Date() },
    });

    await loanService.upgradeUserLevel(repayment.loan.userId);

    const io = getIO();
    io.to(`user:${repayment.loan.userId}`).emit("loan:cleared", { loanId: repayment.loanId });

    return updated;
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
