"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { adminService } from "@/services/admin.service";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" as const });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminService.login(form.email, form.password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      setToast({ show: true, message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <p className="text-2xl font-bold text-secondary-900">Admin</p>
          <p className="text-sm text-secondary-500">Sign in to manage the platform</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@loanplatform.com" />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password" />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" isLoading={loading} fullWidth>Sign In</Button>
        </form>
      </div>
      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
