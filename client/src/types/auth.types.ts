export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  avatarUrl?: string | null;
  verified: boolean;
  isActive?: boolean;
  loanLevel: number;
  createdAt: string;
  _count?: { loans: number; verifications: number };
  activeLoan?: Loan | null;
}

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  interestRate: number;
  status: LoanStatus;
  purpose?: string | null;
  dueDate?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  repaidAt?: string | null;
  createdAt: string;
  repayments: Repayment[];
  user?: { fullName: string; phone: string };
}

export type LoanStatus = "pending" | "approved" | "active" | "repaid" | "overdue" | "rejected" | "expired";

export interface Repayment {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  dueDate: string;
  paidAt?: string | null;
  status: RepaymentStatus;
  method?: string | null;
  reference?: string | null;
  clearedBy?: string | null;
  clearedAt?: string | null;
  createdAt: string;
  loan?: { amount: number; status: string };
  user?: { fullName: string; phone: string };
}

export type RepaymentStatus = "pending" | "paid" | "overdue";
