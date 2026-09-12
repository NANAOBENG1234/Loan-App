import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export async function getMyNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const notifications = await notificationService.getForUser(req.user!.id);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await notificationService.getUnreadCount(req.user!.id);
    res.json({ count });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationRead(req: Request, res: Response, next: NextFunction) {
  try {
    await notificationService.markRead(req.params.id, req.user!.id);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

export async function markAllNotificationsRead(req: Request, res: Response, next: NextFunction) {
  try {
    await notificationService.markAllRead(req.user!.id);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}