"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationStore } from "@/store/notificationStore";
import { notificationService } from "@/services/notification.service";
import { timeAgo } from "@/utils/formatDate";
import { useState } from "react";

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { items, hydrate, markReadLocal, markAllReadLocal } = useNotificationStore();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) hydrate();
  }, [isAuthenticated, hydrate]);

  if (isLoading) return <Loader fullScreen />;

  const unread = items.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    markAllReadLocal();
    setBusy(true);
    await notificationService.markAllRead().catch(() => {});
    setBusy(false);
  };

  const handleMarkRead = async (id: string) => {
    const target = items.find((n) => n.id === id);
    if (target && !target.read) {
      markReadLocal(id);
      notificationService.markRead(id).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DashboardHeader />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Notifications</h2>
          {unread > 0 && (
            <Button size="sm" variant="secondary" onClick={handleMarkAllRead} isLoading={busy}>
              Mark all as read
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-secondary-500">No notifications yet</p>
            <p className="text-xs text-secondary-400 mt-1">Updates about your loans will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`w-full text-left rounded-xl border p-4 transition-colors ${n.read ? "border-secondary-100 bg-white" : "border-primary-100 bg-primary-50/40"}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1.5 size-2 rounded-full shrink-0 ${n.read ? "bg-secondary-200" : "bg-primary-500"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-secondary-800">{n.title}</p>
                    <p className="text-sm text-secondary-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-secondary-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}