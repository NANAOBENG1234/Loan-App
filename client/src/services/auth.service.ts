import api from "./api";
import { User } from "@/types/auth.types";

export const authService = {
  async register(data: { fullName: string; phone: string; email?: string; password: string }) {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  async login(data: { phone: string; password: string }) {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  async logout() {
    await api.post("/auth/logout");
  },

  async getProfile(): Promise<User> {
    const res = await api.get("/auth/profile");
    return res.data;
  },
};
