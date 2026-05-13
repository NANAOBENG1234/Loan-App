import { Server as SocketServer, Socket } from "socket.io";

export function setupNotificationsSocket(_io: SocketServer, socket: Socket) {
  socket.on("notification:markRead", (notificationId: string) => {
    socket.emit("notification:marked", { id: notificationId });
  });
}
