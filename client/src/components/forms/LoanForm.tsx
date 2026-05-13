"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { loanService } from "@/services/loan.service";
import { LOAN_LEVELS } from "@/utils/constants";

interface LoanFormProps {
  userLevel: number;
  onSuccess: () => void;
}

export function LoanForm({ userLevel, onSuccess }: LoanFormProps) {
  const levelIndex = Math.min(userLevel - 1, LOAN_LEVELS.length - 1);
  const level = LOAN_LEVELS[levelIndex];
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as const });

  const presetAmounts = [level.maxAmount * 0.25, level.maxAmount * 0.5, level.maxAmount * 0.75, level.maxAmount].map(
    (a) => Math.round(a)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1) return setError("Enter a valid amount");
    if (numAmount > level.maxAmount) return setError(`Maximum loan is GHS ${level.maxAmount}`);

    setLoading(true);
    try {
      await loanService.apply({ amount: numAmount, purpose: purpose || undefined });
      setToast({ show: true, message: "Loan application submitted!", type: "success" });
      setTimeout(onSuccess, 800);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Application failed";
      setError(msg);
      setToast({ show: true, message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-soft-green rounded-xl p-4 text-sm text-primary-800">
          Your maximum loan: <strong>GHS {level.maxAmount}</strong> at {level.interestRate}% interest
        </div>
        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(String(a))}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                Number(amount) === a ? "bg-primary-500 text-white" : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
              }`}
            >
              GHS {a}
            </button>
          ))}
        </div>
        <Input
          label="Custom Amount (GHS)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min="1"
          max={level.maxAmount}
        />
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">Purpose (optional)</label>
          <select className="input-field" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option value="">Select purpose</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <div className="text-xs text-secondary-400 space-y-1">
          <p>Interest: {level.interestRate}% ({((level.interestRate / 100) * (Number(amount) || 0)).toFixed(2)})</p>
          <p>Repayment: 6 days</p>
        </div>
        <Button type="submit" isLoading={loading} fullWidth size="lg">
          Submit Application
        </Button>
      </form>
      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </>
  );
}
