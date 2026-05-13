"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/utils/formatDate";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DashboardHeader />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="card text-center py-8">
          <div className="size-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <h2 className="text-xl font-bold">{user?.fullName}</h2>
          <p className="text-sm text-secondary-500">{user?.phone}</p>
          {user?.email && <p className="text-sm text-secondary-400">{user.email}</p>}
        </div>

        <div className="card space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-secondary-500">Loan Level</span>
            <span className="font-semibold">Level {user?.loanLevel}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-secondary-500">Verified</span>
            <span className={user?.verified ? "chip chip-paid" : "chip chip-pending"}>
              {user?.verified ? "Verified" : "Unverified"}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-secondary-500">Member Since</span>
            <span className="font-medium text-sm">{user?.createdAt ? formatDate(user.createdAt) : "-"}</span>
          </div>
        </div>

        <Button variant="danger" fullWidth onClick={() => { logout(); router.push("/"); }}>
          Sign Out
        </Button>
      </main>
      <BottomNav />
    </div>
  );
}
