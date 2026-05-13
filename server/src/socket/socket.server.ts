import { Server as SocketServer } from "socket.io";
import { verifyToken } from "../utils/generateToken";
import { logger } from "../utils/logger";

export function setupSocket(io: SocketServer) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const decoded = verifyToken(token as string);
      (socket as any).user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = (socket as any).user;
    logger.info(`Socket connected: ${user.phone}`);

    socket.join(`user:${user.id}`);

    if (user.role === "admin" || user.role === "superadmin") {
      socket.join("admin");
    }

    socket.on("countdown:subscribe", (loanId: string) => {
      socket.join(`loan:${loanId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${user.phone}`);
    });
  });
}
