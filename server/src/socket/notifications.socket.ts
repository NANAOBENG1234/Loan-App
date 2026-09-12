import { Server as SocketServer, Socket } from "socket.io";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export function setupNotificationsSocket(_io: SocketServer, socket: Socket) {
  const user = (socket as any).user;

  socket.on("notification:markRead", async (notificationId: string) => {
    if (!user?.id || typeof notificationId !== "string") return;
    await notificationService.markRead(notificationId, user.id);
    socket.emit("notification:marked", { id: notificationId });
  });

  socket.on("notification:markAllRead", async () => {
    if (!user?.id) return;
    await notificationService.markAllRead(user.id);
    socket.emit("notification:marked", { all: true });
  });
}