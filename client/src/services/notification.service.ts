import api from "./api";
import { Notification } from "@/types/user.types";

export const notificationService = {
  async getMine(): Promise<Notification[]> {
    const res = await api.get("/notifications/me");
    return res.data;
  },

  async getUnreadCount(): Promise<number> {
    const res = await api.get("/notifications/me/unread-count");
    return res.data.count;
  },

  async markRead(id: string) {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllRead() {
    const res = await api.put("/notifications/read-all");
    return res.data;
  },
};