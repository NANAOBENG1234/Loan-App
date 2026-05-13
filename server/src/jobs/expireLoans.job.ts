import cron from "node-cron";
import prisma from "../config/db";
import { getIO } from "../config/socket";
import { logger } from "../utils/logger";

export function startExpireLoansJob() {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();
      const expired = await prisma.loan.updateMany({
        where: { status: "active", dueDate: { lt: now } },
        data: { status: "overdue" },
      });

      if (expired.count > 0) {
        logger.info(`Marked ${expired.count} loans as overdue`);

        const overdueLoans = await prisma.loan.findMany({
          where: { status: "overdue", dueDate: { lt: now } },
          select: { userId: true, id: true },
        });

        const io = getIO();
        for (const loan of overdueLoans) {
          io.to(`user:${loan.userId}`).emit("loan:overdue", { loanId: loan.id });
        }
      }
    } catch (error) {
      logger.error("Expire loans job failed:", error);
    }
  });
}
