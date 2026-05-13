import { LoanLevelConfig } from "../types/loan.types";

export const LOAN_LEVELS: LoanLevelConfig[] = [
  { level: 1, maxAmount: 100, interestRate: 10, repaymentDays: 6, name: "Bronze" },
  { level: 2, maxAmount: 300, interestRate: 8, repaymentDays: 6, name: "Silver" },
  { level: 3, maxAmount: 500, interestRate: 7, repaymentDays: 6, name: "Gold" },
  { level: 4, maxAmount: 1000, interestRate: 5, repaymentDays: 6, name: "Platinum" },
];

export function getLoanLevel(level: number): LoanLevelConfig {
  const index = Math.min(Math.max(level - 1, 0), LOAN_LEVELS.length - 1);
  return LOAN_LEVELS[index];
}

export function getNextLevel(level: number): LoanLevelConfig | null {
  const next = LOAN_LEVELS[level];
  return next || null;
}
