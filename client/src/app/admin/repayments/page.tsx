"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { adminService } from "@/services/admin.service";
import { Repayment } from "@/types/auth.types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { STATUS_CONFIG } from "@/utils/constants";

export default function AdminRepaymentsPage() {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as const });

  const loadData = () => adminService.getRepayments().then(setRepayments).finally(() => setLoading(false));

  useEffect(() => { loadData(); }, []);

  const handleClear = async (id: string) => {
    try {
      await adminService.clearRepayment(id);
      setToast({ show: true, message: "Repayment cleared! User level upgraded.", type: "success" });
      loadData();
    } catch {
      setToast({ show: true, message: "Failed to clear repayment", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <AdminSidebar />
      <main className="lg:ml-64 p-4 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Repayments</h1>

        {loading ? <Loader /> : (
          <div className="space-y-6">
            {/* Pending repayments */}
            {repayments.filter((r) => r.status === "pending").length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-secondary-500 mb-3">Pending Confirmation</h3>
                <div className="grid gap-4">
                  {repayments.filter((r) => r.status === "pending").map((repayment) => (
                    <div key={repayment.id} className="card border-l-4 border-l-yellow-500">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-lg">{formatCurrency(repayment.amount)}</p>
                          <p className="text-sm text-secondary-500">
                            {repayment.user?.fullName || "Unknown"} • {repayment.user?.phone || ""}
                          </p>
                        </div>
                        <span className="chip chip-pending">Pending</span>
                      </div>
                      <div className="text-sm text-secondary-500 mb-3">
                        <p>Due: {formatDate(repayment.dueDate)}</p>
                        {repayment.reference && <p>Ref: {repayment.reference}</p>}
                      </div>
                      <Button size="sm" onClick={() => handleClear(repayment.id)}>Confirm & Clear</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All repayments */}
            <div>
              <h3 className="text-sm font-medium text-secondary-500 mb-3">All Repayments</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">User</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Due</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Cleared</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repayments.map((r) => (
                      <tr key={r.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                        <td className="py-3 px-4">{r.user?.fullName || "—"}</td>
                        <td className="py-3 px-4 font-medium">{formatCurrency(r.amount)}</td>
                        <td className="py-3 px-4">
                          <span className={STATUS_CONFIG[r.status]?.color || "chip-pending"}>{r.status}</span>
                        </td>
                        <td className="py-3 px-4 text-secondary-500">{formatDate(r.dueDate)}</td>
                        <td className="py-3 px-4 text-secondary-500">{r.clearedAt ? formatDate(r.clearedAt) : "—"}</td>
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
