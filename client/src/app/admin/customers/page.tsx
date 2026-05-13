"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { adminService } from "@/services/admin.service";
import { User } from "@/types/auth.types";
import { formatDate } from "@/utils/formatDate";

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newLevel, setNewLevel] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as const });

  const loadData = () => adminService.getUsers().then(setUsers).finally(() => setLoading(false));

  useEffect(() => { loadData(); }, []);

  const handleUpdateLevel = async () => {
    if (!selectedUser) return;
    try {
      await adminService.updateUserLevel(selectedUser.id, newLevel);
      setToast({ show: true, message: "Level updated!", type: "success" });
      setSelectedUser(null);
      loadData();
    } catch {
      setToast({ show: true, message: "Failed to update level", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <AdminSidebar />
      <main className="lg:ml-64 p-4 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Customers</h1>
        <div className="card overflow-x-auto">
          {loading ? <Loader /> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 font-medium text-secondary-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-500">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-500">Level</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-500">Verified</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-500">Loans</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-500">Joined</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="py-3 px-4 font-medium">{user.fullName}</td>
                    <td className="py-3 px-4 text-secondary-500">{user.phone}</td>
                    <td className="py-3 px-4">
                      <span className="chip bg-primary-100 text-primary-700">Lvl {user.loanLevel}</span>
                    </td>
                    <td className="py-3 px-4">
                      {user.verified ? (
                        <span className="chip chip-paid">Yes</span>
                      ) : (
                        <span className="chip chip-pending">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{(user as any)._count?.loans || 0}</td>
                    <td className="py-3 px-4 text-secondary-500">{formatDate(user.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedUser(user); setNewLevel(user.loanLevel); }}>
                        Edit Level
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Update Loan Level">
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-sm text-secondary-500">
              {selectedUser.fullName} - Current Level: {selectedUser.loanLevel}
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((l) => (
                <button
                  key={l}
                  onClick={() => setNewLevel(l)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    newLevel === l ? "bg-primary-500 text-white" : "bg-secondary-100 text-secondary-600"
                  }`}
                >
                  Level {l}
                </button>
              ))}
            </div>
            <Button onClick={handleUpdateLevel} fullWidth>Update</Button>
          </div>
        )}
      </Modal>

      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
