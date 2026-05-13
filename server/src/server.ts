import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import http from "http";
import app from "./app";
import { initSocket } from "./config/socket";
import { setupSocket } from "./socket/socket.server";
import { startExpireLoansJob } from "./jobs/expireLoans.job";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = initSocket(server);
setupSocket(io);

startExpireLoansJob();

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
