"use client";

import { Loan } from "@/types/auth.types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { STATUS_CONFIG } from "@/utils/constants";

interface LoanCardProps {
  loan: Loan;
  onClick?: () => void;
}

export function LoanCard({ loan, onClick }: LoanCardProps) {
  const config = STATUS_CONFIG[loan.status] || STATUS_CONFIG.pending;

  return (
    <div className="card cursor-pointer hover:shadow-md transition-all active:scale-[0.99]" onClick={onClick}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold">{formatCurrency(loan.amount)}</span>
        <span className={config.color}>{config.label}</span>
      </div>
      <div className="space-y-1.5 text-sm text-secondary-500">
        <div className="flex justify-between">
          <span>Interest</span>
          <span className="font-medium text-secondary-700">{loan.interestRate}%</span>
        </div>
        <div className="flex justify-between">
          <span>Applied</span>
          <span className="font-medium text-secondary-700">{formatDate(loan.createdAt)}</span>
        </div>
        {loan.dueDate && (
          <div className="flex justify-between">
            <span>Due</span>
            <span className="font-medium text-secondary-700">{formatDate(loan.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
