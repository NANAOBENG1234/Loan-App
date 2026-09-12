import prisma from "../config/db";
import { getIO } from "../config/socket";

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: string;
}

export class NotificationService {
  async create({ userId, title, message, type }: CreateNotificationInput) {
    const notification = await prisma.notification.create({
      data: { userId, title, message, type: type || "info", read: false },
    });

    try {
      getIO().to(`user:${userId}`).emit("notification:new", notification);
    } catch (error) {
      // Socket may not be initialized in tests; the notification is still persisted.
    }

    return notification;
  }

  async getForUser(userId: string, limit = 50) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, read: false } });
  }

  async markRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}