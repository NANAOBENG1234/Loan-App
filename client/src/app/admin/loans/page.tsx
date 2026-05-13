"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { adminService } from "@/services/admin.service";
import { Loan } from "@/types/auth.types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { STATUS_CONFIG } from "@/utils/constants";

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as const });

  const loadLoans = () => adminService.getLoans().then(setLoans).finally(() => setLoading(false));

  useEffect(() => { loadLoans(); }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveLoan(id);
      setToast({ show: true, message: "Loan approved!", type: "success" });
      loadLoans();
    } catch {
      setToast({ show: true, message: "Failed to approve", type: "error" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.rejectLoan(id);
      setToast({ show: true, message: "Loan rejected", type: "success" });
      loadLoans();
    } catch {
      setToast({ show: true, message: "Failed to reject", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <AdminSidebar />
      <main className="lg:ml-64 p-4 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Loan Management</h1>

        {loading ? <Loader /> : (
          <div className="space-y-4">
            {/* Pending loans */}
            {loans.filter((l) => l.status === "pending").length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-secondary-500 mb-3">Pending Approval</h3>
                <div className="grid gap-4">
                  {loans.filter((l) => l.status === "pending").map((loan) => (
                    <div key={loan.id} className="card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-lg">{formatCurrency(loan.amount)}</p>
                          <p className="text-sm text-secondary-500">
                            {loan.user?.fullName || "Unknown"} • {loan.user?.phone || ""}
                          </p>
                        </div>
                        <span className={STATUS_CONFIG[loan.status]?.color || "chip-pending"}>{loan.status}</span>
                      </div>
                      <div className="text-sm text-secondary-500 mb-3">
                        <p>Interest: {loan.interestRate}% | Duration: 6 days</p>
                        <p>Applied: {formatDate(loan.createdAt)}</p>
                        {loan.purpose && <p>Purpose: {loan.purpose}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(loan.id)}>Approve</Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(loan.id)}>Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All loans */}
            <div>
              <h3 className="text-sm font-medium text-secondary-500 mb-3">All Loans</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">User</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Interest</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                        <td className="py-3 px-4">{loan.user?.fullName || "—"}</td>
                        <td className="py-3 px-4 font-medium">{formatCurrency(loan.amount)}</td>
                        <td className="py-3 px-4">
                          <span className={STATUS_CONFIG[loan.status]?.color || "chip-pending"}>{loan.status}</span>
                        </td>
                        <td className="py-3 px-4">{loan.interestRate}%</td>
                        <td className="py-3 px-4 text-secondary-500">{formatDate(loan.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
