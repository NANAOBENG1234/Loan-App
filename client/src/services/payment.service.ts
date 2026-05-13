import api from "./api";
import { Repayment } from "@/types/auth.types";

export const paymentService = {
  async initiate(loanId: string, amount: number, method?: string) {
    const res = await api.post("/payments/initiate", { loanId, amount, method });
    return res.data;
  },

  async getAll(): Promise<Repayment[]> {
    const res = await api.get("/payments");
    return res.data;
  },

  async getLoanRepayments(loanId: string): Promise<Repayment[]> {
    const res = await api.get(`/payments/${loanId}`);
    return res.data;
  },
};
