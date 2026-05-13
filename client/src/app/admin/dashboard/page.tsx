"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader } from "@/components/ui/Loader";
import { adminService, DashboardStats } from "@/services/admin.service";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: "👥", href: "/admin/customers", color: "bg-blue-500" },
    { label: "Total Loans", value: stats?.totalLoans || 0, icon: "💰", href: "/admin/loans", color: "bg-green-500" },
    { label: "Active Loans", value: stats?.activeLoans || 0, icon: "📈", href: "/admin/loans", color: "bg-primary-500" },
    { label: "Pending", value: stats?.pendingLoans || 0, icon: "⏳", href: "/admin/loans", color: "bg-yellow-500" },
    { label: "Repaid", value: stats?.repaidLoans || 0, icon: "✅", href: "/admin/repayments", color: "bg-emerald-500" },
    { label: "Verified", value: stats?.totalVerified || 0, icon: "🪪", href: "/admin/customers", color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <AdminSidebar />
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-secondary-400">Loan Platform Admin</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link key={card.label} href={card.href} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-xl ${card.color} flex items-center justify-center text-white text-lg`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs text-secondary-400">{card.label}</p>
                  <p className="text-xl font-bold">{card.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="card mt-6">
          <h3 className="font-semibold mb-2">Total Loan Volume</h3>
          <p className="text-3xl font-bold text-primary-600">GHS {(stats?.totalLoanAmount || 0).toLocaleString()}</p>
        </div>
      </main>
    </div>
  );
}
