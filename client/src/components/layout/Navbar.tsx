"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary-600">
          LoanApp
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <span className="text-sm text-gray-500">{user?.firstName}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
