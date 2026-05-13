import api from "./api";
import { Loan } from "@/types/auth.types";

export const loanService = {
  async apply(data: { amount: number; purpose?: string }) {
    const res = await api.post("/loans/apply", data);
    return res.data;
  },

  async getAll(): Promise<Loan[]> {
    const res = await api.get("/loans");
    return res.data;
  },

  async getCurrent(): Promise<Loan | null> {
    const res = await api.get("/loans/current");
    return res.data;
  },

  async getById(id: string): Promise<Loan> {
    const res = await api.get(`/loans/${id}`);
    return res.data;
  },
};
