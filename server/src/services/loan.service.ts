import prisma from "../config/db";
import { calculateLoanRepayment } from "../utils/calculateLoan";
import { getLoanLevel, getNextLevel } from "../constants/loanLevels";
import { getIO } from "../config/socket";

export class LoanService {
  async apply(userId: string, amount: number, purpose?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const activeLoan = await prisma.loan.findFirst({
      where: { userId, status: { in: ["active", "approved", "pending"] } },
    });
    if (activeLoan) throw new Error("You already have an active loan. Repay it first.");

    const level = getLoanLevel(user.loanLevel);
    if (amount > level.maxAmount) {
      throw new Error(`Your maximum loan amount is GHS ${level.maxAmount} at ${level.name} level`);
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
      where: { userId, status: { in: ["active", "approved", "pending"] } },
      include: { repayments: { orderBy: { dueDate: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async getLoanById(loanId: string, userId: string) {
    const loan = await prisma.loan.findFirst({
      where: { id: loanId, userId },
      include: { repayments: { orderBy: { dueDate: "asc" } } },
    });
    if (!loan) throw new Error("Loan not found");
    return loan;
  }

  async approveLoan(loanId: string, adminId: string) {
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new Error("Loan not found");
    if (loan.status !== "pending") throw new Error("Loan is not pending");

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

    return updated;
  }

  async rejectLoan(loanId: string) {
    return prisma.loan.update({
      where: { id: loanId },
      data: { status: "rejected" },
    });
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
