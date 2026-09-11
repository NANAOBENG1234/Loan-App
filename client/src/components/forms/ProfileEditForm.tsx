"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User } from "@/types/auth.types";
import { userService } from "@/services/user.service";
import { isValidPhone, isValidEmail } from "@/utils/validators";
import { useAuthStore } from "@/store/authStore";

interface ProfileEditFormProps {
  user: User;
  onCancel: () => void;
  onSaved: (user: User) => void;
  onError: (message: string) => void;
}

export function ProfileEditForm({ user, onCancel, onSaved, onError }: ProfileEditFormProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    phone: user.phone || "",
    email: user.email || "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; phone?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (form.fullName.trim().length < 3) errors.fullName = "Full name must be at least 3 characters";
    if (!isValidPhone(form.phone)) errors.phone = "Enter a valid Ghana phone number (e.g., 024XXXXXXX)";
    if (form.email && !isValidEmail(form.email)) errors.email = "Enter a valid email address";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const updated = await userService.updateProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
      });
      setUser(updated);
      onSaved(updated);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update profile";
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        placeholder="Your full name"
        error={fieldErrors.fullName}
      />
      <Input
        label="Phone Number"
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="024 000 0000"
        error={fieldErrors.phone}
      />
      <Input
        label="Email (optional)"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="you@example.com"
        error={fieldErrors.email}
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={loading}>Save Changes</Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
      </div>
    </form>
  );
}