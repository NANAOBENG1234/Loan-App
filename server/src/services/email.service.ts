import { sendMail } from "../config/mail";
import { logger } from "../utils/logger";

export class EmailService {
  async sendLoanRequestToAdmin(userName: string, phone: string, amount: number, level: number) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@loanplatform.com";
      const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
      await sendMail(
        adminEmail,
        `New Loan Request - GHS ${amount} from ${userName}`,
        `
        <h2>New Loan Application</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Amount:</strong> GHS ${amount}</p>
        <p><strong>Level:</strong> ${level}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><a href="${clientUrl}/admin/loans" style="background:#7ED957;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;margin-top:10px;">Review in Admin Panel</a></p>
        `
      );
      logger.info(`Loan request email sent to admin for ${phone}`);
    } catch (error) {
      logger.error("Failed to send loan request email:", error);
    }
  }

  async sendWelcomeEmail(email: string, fullName: string) {
    if (!email) return;
    try {
      await sendMail(
        email,
        "Welcome to QuickLoan - Your Trusted Loan Platform",
        `<h1>Welcome, ${fullName}!</h1><p>Your account has been created. Apply for your first loan today.</p>`
      );
    } catch (error) {
      logger.error("Failed to send welcome email:", error);
    }
  }
}
