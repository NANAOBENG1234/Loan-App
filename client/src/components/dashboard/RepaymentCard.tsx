"use client";

import { Repayment } from "@/types/auth.types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { STATUS_CONFIG } from "@/utils/constants";

interface RepaymentCardProps {
  repayment: Repayment;
}

export function RepaymentCard({ repayment }: RepaymentCardProps) {
  const config = STATUS_CONFIG[repayment.status] || STATUS_CONFIG.pending;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold">{formatCurrency(repayment.amount)}</span>
        <span className={config.color}>{config.label}</span>
      </div>
      <div className="text-sm text-secondary-500 space-y-1">
        <div className="flex justify-between">
          <span>Due</span>
          <span className="font-medium text-secondary-700">{formatDate(repayment.dueDate)}</span>
        </div>
        {repayment.paidAt && (
          <div className="flex justify-between">
            <span>Paid</span>
            <span className="font-medium text-secondary-700">{formatDate(repayment.paidAt)}</span>
          </div>
        )}
        {repayment.reference && (
          <div className="flex justify-between">
            <span>Ref</span>
            <span className="font-medium text-secondary-700 text-xs">{repayment.reference}</span>
          </div>
        )}
      </div>
    </div>
  );
}
