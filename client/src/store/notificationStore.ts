import { create } from "zustand";
import { Notification } from "@/types/user.types";
import { notificationService } from "@/services/notification.service";

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  hydrate: () => Promise<void>;
  addOne: (notification: Notification) => void;
  markReadLocal: (id: string) => void;
  markAllReadLocal: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  unreadCount: 0,

  async hydrate() {
    try {
      const [items, unreadCount] = await Promise.all([
        notificationService.getMine(),
        notificationService.getUnreadCount(),
      ]);
      set({ items, unreadCount });
    } catch {
      // Not authenticated or offline; keep current state.
    }
  },

  addOne(notification) {
    const exists = get().items.some((n) => n.id === notification.id);
    if (exists) return;
    set((state) => ({
      items: [notification, ...state.items].slice(0, 100),
      unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
    }));
  },

  markReadLocal(id) {
    set((state) => {
      const target = state.items.find((n) => n.id === id);
      const wasUnread = target && !target.read;
      return {
        items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },

  markAllReadLocal() {
    set((state) => ({
      items: state.items.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
}));