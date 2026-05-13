"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/loans", label: "Loans", icon: "💰" },
  { href: "/admin/repayments", label: "Repayments", icon: "💳" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-secondary-900 text-white overflow-y-auto hidden lg:block">
        <div className="p-5 border-b border-secondary-700">
          <Link href="/admin/dashboard" className="text-lg font-bold">QuickLoan Admin</Link>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive ? "bg-primary-500 text-white" : "text-secondary-300 hover:bg-secondary-800"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link href="/" className="text-xs text-secondary-500 hover:text-secondary-300">← Back to site</Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-secondary-900 text-white p-4 flex items-center justify-between">
        <span className="font-bold">Admin Panel</span>
        <div className="flex gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`px-3 py-1.5 rounded-lg text-xs ${pathname === link.href ? "bg-primary-500" : "bg-secondary-800"}`}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
