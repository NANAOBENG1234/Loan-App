"use client";

import { useAuthStore } from "@/store/authStore";

export function DashboardHeader() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="bg-white border-b border-secondary-100 px-4 py-4 lg:py-5">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-xs text-secondary-400 font-medium">Welcome back</p>
          <h1 className="text-lg lg:text-xl font-bold text-secondary-800">
            {user?.fullName?.split(" ")[0] || "User"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
            {user?.fullName?.charAt(0) || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
