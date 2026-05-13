"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DashboardHeader />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <h2 className="text-xl font-bold">Settings</h2>

        <div className="card space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Notifications</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="size-5 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-secondary-600">Push notifications</span>
            </label>
          </div>

          <div className="pt-4 border-t border-secondary-100">
            <h3 className="font-semibold mb-3">Account</h3>
            <Button variant="danger" size="sm">Delete Account</Button>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
