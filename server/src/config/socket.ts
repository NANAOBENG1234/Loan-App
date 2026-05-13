import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server;

export function initSocket(httpServer: HttpServer) {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? clientUrl : ["http://localhost:3000"],
      credentials: true,
    },
  });
  return io;
}

export function getIO(): Server {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
