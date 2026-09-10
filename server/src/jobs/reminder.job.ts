import cron from "node-cron";
import prisma from "../config/db";
import { logger } from "../utils/logger";
import { EmailService } from "../services/email.service";

const emailService = new EmailService();

export function startReminderJob() {
  cron.schedule("0 8 * * *", async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const repayments = await prisma.repayment.findMany({
        where: {
          status: "pending",
          dueDate: {
            gte: new Date(),
            lte: tomorrow,
          },
        },
        include: {
          user: { select: { email: true, fullName: true } },
        },
      });

      for (const repayment of repayments) {
        if (repayment.user.email) {
          await emailService.sendRepaymentReminder(
            repayment.user.email,
            repayment.user.fullName,
            repayment.amount,
            repayment.dueDate.toLocaleDateString()
          );
        }
      }

      if (repayments.length > 0) {
        logger.info(`Sent ${repayments.length} repayment reminders`);
      }
    } catch (error) {
      logger.error("Reminder job failed:", error);
    }
  });
}
