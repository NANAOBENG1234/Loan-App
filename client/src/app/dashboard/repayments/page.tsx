"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { RepaymentCard } from "@/components/dashboard/RepaymentCard";
import { Modal } from "@/components/ui/Modal";
import { Loader } from "@/components/ui/Loader";
import { RepaymentForm } from "@/components/forms/RepaymentForm";
import { useAuth } from "@/hooks/useAuth";
import { paymentService } from "@/services/payment.service";
import { loanService } from "@/services/loan.service";
import { Repayment, Loan } from "@/types/auth.types";

export default function RepaymentsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [showRepayment, setShowRepayment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        paymentService.getAll(),
        loanService.getCurrent(),
      ]).then(([r, l]) => {
        setRepayments(r);
        setActiveLoan(l);
      }).finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (isLoading) return <Loader fullScreen />;

  const pendingRepayments = repayments.filter((r) => r.status === "pending" || r.status === "overdue");
  const paidRepayments = repayments.filter((r) => r.status === "paid");

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DashboardHeader />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-6">Repayments</h2>

        {activeLoan && activeLoan.status === "active" && (
          <div className="card bg-soft-green border border-primary-200 mb-4">
            <p className="text-sm text-primary-800 mb-2">You have an active loan</p>
            <button onClick={() => setShowRepayment(true)} className="text-primary-600 font-semibold text-sm hover:underline">
              Make a repayment →
            </button>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : repayments.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-secondary-500">No repayments yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRepayments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-secondary-500 mb-3">Pending</h3>
                <div className="grid gap-3">
                  {pendingRepayments.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <RepaymentCard repayment={r} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {paidRepayments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-secondary-500 mb-3">Completed</h3>
                <div className="grid gap-3">
                  {paidRepayments.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                      <RepaymentCard repayment={r} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <BottomNav />

      {activeLoan && (
        <Modal isOpen={showRepayment} onClose={() => setShowRepayment(false)} title="Repay Loan">
          <RepaymentForm
            loanId={activeLoan.id}
            amount={activeLoan.amount + (activeLoan.amount * activeLoan.interestRate) / 100}
            onSuccess={() => { setShowRepayment(false); paymentService.getAll().then(setRepayments); }}
          />
        </Modal>
      )}
    </div>
  );
}
