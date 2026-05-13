"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader } from "@/components/ui/Loader";
import { adminService } from "@/services/admin.service";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-secondary-50">
      <AdminSidebar />
      <main className="lg:ml-64 p-4 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <p className="text-sm text-secondary-500 mb-1">Loan Portfolio</p>
            <p className="text-3xl font-bold">GHS {(stats?.totalLoanAmount || 0).toLocaleString()}</p>
          </div>
          <div className="card">
            <p className="text-sm text-secondary-500 mb-1">Verification Rate</p>
            <p className="text-3xl font-bold">
              {stats?.totalUsers ? Math.round(((stats?.totalVerified || 0) / stats.totalUsers) * 100) : 0}%
            </p>
            <p className="text-xs text-secondary-400">{stats?.totalVerified || 0} of {stats?.totalUsers || 0} users</p>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3">Loan Summary</h3>
          <div className="space-y-3">
            {[
              { label: "Total Loans", value: stats?.totalLoans, color: "bg-blue-500" },
              { label: "Active", value: stats?.activeLoans, color: "bg-primary-500" },
              { label: "Pending", value: stats?.pendingLoans, color: "bg-yellow-500" },
              { label: "Repaid", value: stats?.repaidLoans, color: "bg-green-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                <span className="text-sm flex-1 text-secondary-600">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
