"use client";

import { Loan } from "@/types/auth.types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";

interface LoanApprovalCardProps {
  loan: Loan;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function LoanApprovalCard({ loan, onApprove, onReject }: LoanApprovalCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-lg">{formatCurrency(loan.amount)}</span>
        <span className="text-xs text-secondary-500">{loan.user?.fullName || "Unknown"}</span>
      </div>
      <div className="text-sm text-secondary-500 mb-3 space-y-1">
        <p>Interest: {loan.interestRate}%</p>
        <p>Applied: {formatDate(loan.createdAt)}</p>
        {loan.purpose && <p>Purpose: {loan.purpose}</p>}
      </div>
      {loan.status === "pending" && (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onApprove(loan.id)}>Approve</Button>
          <Button size="sm" variant="danger" onClick={() => onReject(loan.id)}>Reject</Button>
        </div>
      )}
    </div>
  );
}
