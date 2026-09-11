"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { userService } from "@/services/user.service";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  onError: (message: string) => void;
}

export function DeleteAccountModal({ isOpen, onClose, onDeleted, onError }: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!password) {
      setError("Enter your password to confirm");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await userService.deleteAccount(password);
      setPassword("");
      onDeleted();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete account";
      setError(msg);
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account">
      <div className="space-y-4">
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          This deactivates your account. Your loan history is kept for records but you will no longer be able to log in.
          You must clear any active loans first.
        </div>
        <Input
          label="Confirm with your password"
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          placeholder="Enter your password"
          error={error}
          autoComplete="current-password"
        />
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={loading}>Delete Account</Button>
        </div>
      </div>
    </Modal>
  );
}