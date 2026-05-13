"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Home", icon: "📊" },
  { href: "/dashboard/loans", label: "Loans", icon: "💰" },
  { href: "/dashboard/repayments", label: "Pay", icon: "💳" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-xl">{isOpen ? "✕" : "☰"}</span>
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}

      <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40`}>
        <div className="flex justify-around py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${
                pathname === link.href ? "text-primary-600" : "text-gray-500"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
