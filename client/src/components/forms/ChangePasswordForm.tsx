"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { userService } from "@/services/user.service";
import { getPasswordStrength } from "@/utils/validators";

interface ChangePasswordFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function ChangePasswordForm({ onSuccess, onError }: ChangePasswordFormProps) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);

  const pwdStrength = form.newPassword ? getPasswordStrength(form.newPassword) : null;

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!form.currentPassword) errors.currentPassword = "Current password is required";
    if (form.newPassword.length < 6) errors.newPassword = "New password must be at least 6 characters";
    else if (form.newPassword === form.currentPassword) errors.newPassword = "New password must be different from the current one";
    if (form.confirmPassword !== form.newPassword) errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await userService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      onSuccess(result.message || "Password updated successfully");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update password";
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Current Password"
        type="password"
        value={form.currentPassword}
        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        autoComplete="current-password"
        error={fieldErrors.currentPassword}
      />
      <div>
        <Input
          label="New Password"
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          autoComplete="new-password"
          helperText={pwdStrength ? `Strength: ${pwdStrength.label}` : undefined}
          error={fieldErrors.newPassword}
        />
        {pwdStrength && (
          <div className="mt-2 h-1.5 rounded-full bg-secondary-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                pwdStrength.score >= 4 ? "bg-green-500" : pwdStrength.score >= 2 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min((pwdStrength.score / 5) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>
      <Input
        label="Confirm New Password"
        type="password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
      />
      <Button type="submit" isLoading={loading}>Update Password</Button>
    </form>
  );
}