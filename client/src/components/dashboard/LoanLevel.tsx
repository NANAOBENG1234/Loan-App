"use client";

import { LOAN_LEVELS } from "@/utils/constants";
import { formatCurrency } from "@/utils/formatCurrency";

interface LoanLevelProps {
  completedLoans: number;
}

export function LoanLevelIndicator({ completedLoans }: LoanLevelProps) {
  const currentLevel = Math.min(completedLoans, LOAN_LEVELS.length - 1);
  const level = LOAN_LEVELS[currentLevel];

  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Loan Level: {level.name}</h3>
      <div className="flex gap-1 mb-3">
        {LOAN_LEVELS.map((l, i) => (
          <div key={l.level} className={`h-2 flex-1 rounded-full ${i <= currentLevel ? "bg-primary-500" : "bg-secondary-200"}`} />
        ))}
      </div>
      <div className="text-sm text-secondary-500 space-y-1">
        <p>Max: {formatCurrency(level.maxAmount)}</p>
        <p>Interest: {level.interestRate}%</p>
        {currentLevel < LOAN_LEVELS.length - 1 && (
          <p>Next: {LOAN_LEVELS[currentLevel + 1].name} (up to {formatCurrency(LOAN_LEVELS[currentLevel + 1].maxAmount)})</p>
        )}
      </div>
    </div>
  );
}
