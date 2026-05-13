import { getLoanLevel } from "../constants/loanLevels";

export function calculateLoanRepayment(amount: number, userLevel: number) {
  const level = getLoanLevel(userLevel);
  const interestRate = level.interestRate;
  const interest = (amount * interestRate) / 100;
  const totalRepayment = amount + interest;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + level.repaymentDays);

  return {
    amount,
    interest,
    totalRepayment,
    interestRate,
    dueDate,
    level: level.level,
    repaymentDays: level.repaymentDays,
  };
}

export function calculatePenalty(overdueDays: number, amount: number): number {
  return Math.round(amount * 0.02 * overdueDays * 100) / 100;
}
