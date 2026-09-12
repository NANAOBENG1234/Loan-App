import cron from "node-cron";
import prisma from "../config/db";
import { getIO } from "../config/socket";
import { logger } from "../utils/logger";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export function startExpireLoansJob() {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();

      // Select the loans that are transitioning active -> overdue in THIS cycle,
      // then update + notify only those. Emitting over the full overdue set would
      // re-notify already-overdue loans on every subsequent cycle.
      const expiring = await prisma.loan.findMany({
        where: { status: "active", dueDate: { lt: now } },
        select: { id: true, userId: true, amount: true },
      });

      if (expiring.length === 0) return;

      const ids = expiring.map((loan) => loan.id);

      await prisma.loan.updateMany({
        where: { id: { in: ids } },
        data: { status: "overdue" },
      });

      await prisma.repayment.updateMany({
        where: { loanId: { in: ids }, status: "pending" },
        data: { status: "overdue" },
      });

      const io = getIO();
      for (const loan of expiring) {
        io.to(`user:${loan.userId}`).emit("loan:overdue", { loanId: loan.id });
        await notificationService.create({
          userId: loan.userId,
          title: "Loan overdue",
          message: `Your loan of GHS ${loan.amount} is now overdue. Please repay it as soon as possible.`,
          type: "payment",
        });
      }

      logger.info(`Marked ${expiring.length} loans as overdue and notified borrowers`);
    } catch (error) {
      logger.error("Expire loans job failed:", error);
    }
  });
}