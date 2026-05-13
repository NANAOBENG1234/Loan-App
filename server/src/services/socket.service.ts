import { getIO } from "../config/socket";

export class SocketService {
  emitToUser(userId: string, event: string, data: any) {
    getIO().to(`user:${userId}`).emit(event, data);
  }

  emitToAdmin(event: string, data: any) {
    getIO().to("admin").emit(event, data);
  }
}
