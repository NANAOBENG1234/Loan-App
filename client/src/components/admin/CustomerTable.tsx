"use client";

import { User } from "@/types/auth.types";
import { formatDate } from "@/utils/formatDate";

interface CustomerTableProps {
  users: User[];
}

export function CustomerTable({ users }: CustomerTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-secondary-200">
            <th className="text-left py-3 px-4 font-medium text-secondary-500">Name</th>
            <th className="text-left py-3 px-4 font-medium text-secondary-500">Email</th>
            <th className="text-left py-3 px-4 font-medium text-secondary-500">Phone</th>
            <th className="text-left py-3 px-4 font-medium text-secondary-500">Verified</th>
            <th className="text-left py-3 px-4 font-medium text-secondary-500">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-secondary-100 hover:bg-secondary-50">
              <td className="py-3 px-4">{user.fullName}</td>
              <td className="py-3 px-4 text-secondary-500">{user.email || "—"}</td>
              <td className="py-3 px-4 text-secondary-500">{user.phone}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {user.verified ? "Yes" : "No"}
                </span>
              </td>
              <td className="py-3 px-4 text-secondary-500">{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
