import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getMyNotifications, getUnreadCount, markNotificationRead, markAllNotificationsRead } from "../controllers/notification.controller";

const router = Router();

router.get("/me", authenticate, getMyNotifications);
router.get("/me/unread-count", authenticate, getUnreadCount);
router.put("/:id/read", authenticate, markNotificationRead);
router.put("/read-all", authenticate, markAllNotificationsRead);

export default router;