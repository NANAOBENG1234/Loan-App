import prisma from "../config/db";
import { calculateLoanRepayment } from "../utils/calculateLoan";
import { getLoanLevel, getNextLevel } from "../constants/loanLevels";
import { IN_PROGRESS_LOAN_STATUSES } from "../constants/loan";
import { getIO } from "../config/socket";
import { HttpError } from "../utils/HttpError";
import { NotificationService } from "./notification.service";

const notificationService = new NotificationService();

export class LoanService {
  async apply(userId: string, amount: number, purpose?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(404, "User not found");

    const activeLoan = await prisma.loan.findFirst({
      where: { userId, status: { in: [...IN_PROGRESS_LOAN_STATUSES] } },
    });
    if (activeLoan) throw new HttpError(409, "You already have an active loan. Repay it first.");

    const level = getLoanLevel(user.loanLevel);
    if (amount > level.maxAmount) {
      throw new HttpError(400, `Your maximum loan amount is GHS ${level.maxAmount} at ${level.name} level`);
    }

    const repayment = calculateLoanRepayment(amount, user.loanLevel);

    const loan = await prisma.loan.create({
      data: {
        userId,
        amount,
        interestRate: repayment.interestRate,
        status: "pending",
        purpose,
      },
    });

    await notificationService.create({
      userId,
      title: "Loan application submitted",
      message: `Your application for GHS ${amount} is now under review.`,
      type: "loan",
    });

    return { loan, repayment: { ...repayment, dueDate: repayment.dueDate.toISOString() }, level };
  }

  async getUserLoans(userId: string) {
    return prisma.loan.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { repayments: { orderBy: { dueDate: "asc" } } },
    });
  }

  async getCurrentLoan(userId: string) {
    return prisma.loan.findFirst({
      where: { userId, status: { in: [...IN_PROGRESS_LOAN_STATUSES] } },
      include: { repayments: { orderBy: { dueDate: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async getLoanById(loanId: string, userId: string) {
    const loan = await prisma.loan.findFirst({
      where: { id: loanId, userId },
      include: { repayments: { orderBy: { dueDate: "asc" } } },
    });
    if (!loan) throw new HttpError(404, "Loan not found");
    return loan;
  }

  /** Loan + context the detail page needs (level capacity, totals, countdown). */
  async getLoanWithContext(loanId: string, userId: string) {
    const loan = await this.getLoanById(loanId, userId);

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { loanLevel: true } });
    const level = getLoanLevel(user?.loanLevel || 1);
    const nextLevel = getNextLevel(user?.loanLevel || 1);

    const totalDue = loan.amount + (loan.amount * loan.interestRate) / 100;
    const daysRemaining = loan.dueDate
      ? Math.max(0, Math.ceil((new Date(loan.dueDate).getTime() - Date.now()) / 86400000))
      : null;

    return {
      ...loan,
      totalDue,
      daysRemaining,
      level: { name: level.name, maxAmount: level.maxAmount, repaymentDays: level.repaymentDays },
      nextLevel: nextLevel
        ? { level: nextLevel.level, name: nextLevel.name, maxAmount: nextLevel.maxAmount }
        : null,
    };
  }

  async approveLoan(loanId: string, adminId: string) {
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new HttpError(404, "Loan not found");
    if (loan.status !== "pending") throw new HttpError(409, "Loan is not pending");

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 6);

    const updated = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: "active",
        approvedAt: new Date(),
        approvedBy: adminId,
        dueDate,
      },
    });

    await prisma.repayment.create({
      data: {
        loanId,
        userId: loan.userId,
        amount: loan.amount + (loan.amount * loan.interestRate) / 100,
        dueDate,
        status: "pending",
      },
    });

    const io = getIO();
    io.to(`user:${loan.userId}`).emit("loan:approved", { loanId, dueDate: dueDate.toISOString() });

    await notificationService.create({
      userId: loan.userId,
      title: "Loan approved",
      message: `Your loan of GHS ${loan.amount} is approved. Repay GHS ${(loan.amount + (loan.amount * loan.interestRate) / 100).toFixed(2)} by ${dueDate.toLocaleDateString()}.`,
      type: "loan",
    });

    return updated;
  }

  async rejectLoan(loanId: string) {
    const loan = await prisma.loan.findUnique({ where: { id: loanId }, select: { id: true, userId: true } });
    const updated = await prisma.loan.update({
      where: { id: loanId },
      data: { status: "rejected" },
    });

    if (loan) {
      await notificationService.create({
        userId: loan.userId,
        title: "Loan application rejected",
        message: "Your loan application was not approved at this time. You can try again with a lower amount.",
        type: "loan",
      });
    }

    return updated;
  }

  async upgradeUserLevel(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const next = getNextLevel(user.loanLevel);
    if (next) {
      await prisma.user.update({
        where: { id: userId },
        data: { loanLevel: next.level },
      });
    }
  }
}
