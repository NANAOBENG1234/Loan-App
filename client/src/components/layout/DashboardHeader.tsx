"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useSocket } from "@/hooks/useSocket";
import { notificationService } from "@/services/notification.service";
import { timeAgo } from "@/utils/formatDate";

export function DashboardHeader() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const socketRef = useSocket(token);
  const { items, unreadCount, hydrate, addOne, markReadLocal, markAllReadLocal } = useNotificationStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (token) hydrate();
  }, [token, hydrate]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const onNew = (notification: any) => addOne(notification);
    socket.on("notification:new", onNew);
    return () => {
      socket.off("notification:new", onNew);
    };
  }, [socketRef, addOne]);

  const handleMarkAllRead = async () => {
    markAllReadLocal();
    notificationService.markAllRead().catch(() => {});
  };

  const handleItemClick = async (id: string) => {
    const target = items.find((n) => n.id === id);
    if (target && !target.read) {
      markReadLocal(id);
      notificationService.markRead(id).catch(() => {});
    }
    setOpen(false);
    router.push("/dashboard/notifications");
  };

  return (
    <>
      <header className="bg-white border-b border-secondary-100 px-4 py-4 lg:py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-secondary-400 font-medium">Welcome back</p>
            <h1 className="text-lg lg:text-xl font-bold text-secondary-800">
              {user?.fullName?.split(" ")[0] || "User"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="relative size-10 rounded-full bg-secondary-50 hover:bg-secondary-100 flex items-center justify-center text-secondary-600 transition-colors"
                aria-label="Notifications"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {open && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                  <div className="absolute right-0 top-12 z-40 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-secondary-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-secondary-100">
                      <p className="font-semibold text-sm">Notifications</p>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} className="text-xs text-primary-500 hover:text-primary-700">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {items.length === 0 ? (
                        <p className="text-sm text-secondary-400 text-center py-8">No notifications yet</p>
                      ) : (
                        items.slice(0, 6).map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleItemClick(n.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-secondary-50 transition-colors ${n.read ? "" : "bg-primary-50/40"}`}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`mt-1.5 size-2 rounded-full shrink-0 ${n.read ? "bg-secondary-200" : "bg-primary-500"}`} />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-secondary-800">{n.title}</p>
                                <p className="text-xs text-secondary-500 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-secondary-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    <button
                      onClick={() => { setOpen(false); router.push("/dashboard/notifications"); }}
                      className="w-full px-4 py-3 text-center text-sm font-medium text-primary-600 hover:bg-primary-50 border-t border-secondary-100"
                    >
                      View all notifications
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="size-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
              {user?.fullName?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}