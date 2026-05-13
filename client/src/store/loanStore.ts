import { create } from "zustand";
import { Loan } from "@/types/auth.types";

interface LoanState {
  loans: Loan[];
  currentLoan: Loan | null;
  isLoading: boolean;
  setLoans: (loans: Loan[]) => void;
  setCurrentLoan: (loan: Loan | null) => void;
  setLoading: (loading: boolean) => void;
  addLoan: (loan: Loan) => void;
}

export const useLoanStore = create<LoanState>((set) => ({
  loans: [],
  currentLoan: null,
  isLoading: false,
  setLoans: (loans) => set({ loans, isLoading: false }),
  setCurrentLoan: (currentLoan) => set({ currentLoan }),
  setLoading: (isLoading) => set({ isLoading }),
  addLoan: (loan) => set((state) => ({ loans: [loan, ...state.loans] })),
}));
