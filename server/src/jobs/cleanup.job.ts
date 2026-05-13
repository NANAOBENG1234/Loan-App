import cron from "node-cron";
import prisma from "../config/db";
import { logger } from "../utils/logger";

export function startCleanupJob() {
  cron.schedule("0 3 * * 0", async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const expiredVerifications = await prisma.verification.deleteMany({
        where: {
          status: "pending",
          createdAt: { lt: thirtyDaysAgo },
        },
      });

      if (expiredVerifications.count > 0) {
        logger.info(`Cleaned up ${expiredVerifications.count} expired verifications`);
      }
    } catch (error) {
      logger.error("Cleanup job failed:", error);
    }
  });
}
