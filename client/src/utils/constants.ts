export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const LOAN_LEVELS = [
  { level: 1, maxAmount: 100, interestRate: 10, repaymentDays: 6, name: "Bronze" },
  { level: 2, maxAmount: 300, interestRate: 8, repaymentDays: 6, name: "Silver" },
  { level: 3, maxAmount: 500, interestRate: 7, repaymentDays: 6, name: "Gold" },
  { level: 4, maxAmount: 1000, interestRate: 5, repaymentDays: 6, name: "Platinum" },
] as const;

export const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending: { color: "chip-pending", label: "Pending" },
  approved: { color: "chip-approved", label: "Approved" },
  active: { color: "chip-active", label: "Active" },
  repaid: { color: "chip-repaid", label: "Repaid" },
  overdue: { color: "chip-overdue", label: "Overdue" },
  rejected: { color: "chip-rejected", label: "Rejected" },
  expired: { color: "chip-overdue", label: "Expired" },
  paid: { color: "chip-paid", label: "Paid" },
};

export const MOMO_DETAILS = {
  mtn: { name: "MTN Mobile Money", number: "055 123 4567", accountName: "QuickLoan Ghana Ltd", color: "#FFC107" },
  vodafone: { name: "Vodafone Cash", number: "020 123 4567", accountName: "QuickLoan Ghana Ltd", color: "#E53935" },
  airteltigo: { name: "AirtelTigo Money", number: "027 123 4567", accountName: "QuickLoan Ghana Ltd", color: "#1E88E5" },
};
