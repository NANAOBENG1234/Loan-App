"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/loans", label: "My Loans", icon: "💰" },
  { href: "/dashboard/repayments", label: "Repayments", icon: "💳" },
  { href: "/dashboard/verification/selfie", label: "Verify Selfie", icon: "📷" },
  { href: "/dashboard/verification/ghana-card", label: "Ghana Card", icon: "🪪" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block">
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "bg-primary-50 text-primary-700 font-medium" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
