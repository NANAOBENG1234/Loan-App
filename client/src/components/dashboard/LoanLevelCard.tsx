"use client";

import { LOAN_LEVELS } from "@/utils/constants";

interface LoanLevelCardProps {
  currentLevel: number;
}

export function LoanLevelCard({ currentLevel }: LoanLevelCardProps) {
  const levelIndex = Math.min(currentLevel - 1, LOAN_LEVELS.length - 1);
  const level = LOAN_LEVELS[levelIndex];
  const maxLevel = LOAN_LEVELS.length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-secondary-500">Loan Level</p>
        <span className="chip bg-primary-100 text-primary-700 font-semibold">{level.name}</span>
      </div>
      <p className="text-2xl font-bold mb-3">GHS {level.maxAmount}</p>
      <div className="flex gap-1">
        {LOAN_LEVELS.map((l, i) => (
          <div key={l.level} className={`h-2 flex-1 rounded-full transition-colors ${i <= levelIndex ? "bg-primary-500" : "bg-secondary-200"}`} />
        ))}
      </div>
      <p className="text-xs text-secondary-400 mt-2">
        {currentLevel < maxLevel
          ? `Next: GHS ${LOAN_LEVELS[levelIndex + 1]?.maxAmount} at ${LOAN_LEVELS[levelIndex + 1]?.name}`
          : "Maximum level reached"}
      </p>
    </div>
  );
}
