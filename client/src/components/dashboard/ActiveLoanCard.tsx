"use client";

import { Loan } from "@/types/auth.types";
import { formatCurrency } from "@/utils/formatCurrency";
import { CountdownTimer } from "./CountdownTimer";

interface ActiveLoanCardProps {
  loan: Loan;
}

export function ActiveLoanCard({ loan }: ActiveLoanCardProps) {
  const totalDue = loan.amount + (loan.amount * loan.interestRate) / 100;

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/70">Active Loan</p>
        <span className="chip bg-white/20 text-white">{loan.status}</span>
      </div>
      <p className="text-3xl font-bold mb-1">{formatCurrency(loan.amount)}</p>
      <p className="text-sm text-white/70 mb-4">Total to repay: {formatCurrency(totalDue)}</p>
      {loan.dueDate && (
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/70 mb-2">Time Remaining</p>
          <CountdownTimer dueDate={loan.dueDate} />
        </div>
      )}
    </div>
  );
}
