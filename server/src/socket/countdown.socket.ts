import { Server as SocketServer, Socket } from "socket.io";

export function setupCountdownSocket(_io: SocketServer, socket: Socket) {
  socket.on("countdown:subscribe", (loanId: string) => {
    socket.join(`loan:${loanId}`);
  });

  socket.on("countdown:unsubscribe", (loanId: string) => {
    socket.leave(`loan:${loanId}`);
  });
}
