import { Request, Response, NextFunction } from "express";
import { LoanService } from "../services/loan.service";
import { EmailService } from "../services/email.service";
import { loanApplicationSchema } from "../utils/validators";
import prisma from "../config/db";

const loanService = new LoanService();
const emailService = new EmailService();

export async function applyForLoan(req: Request, res: Response, next: NextFunction) {
  try {
    const { amount, purpose } = loanApplicationSchema.parse(req.body);
    const result = await loanService.apply(req.user!.id, amount, purpose);

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    await emailService.sendLoanRequestToAdmin(
      user?.fullName || "Unknown",
      req.user!.phone,
      amount,
      result.level.level
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMyLoans(req: Request, res: Response, next: NextFunction) {
  try {
    const loans = await loanService.getUserLoans(req.user!.id);
    res.json(loans);
  } catch (error) {
    next(error);
  }
}

export async function getCurrentLoan(req: Request, res: Response, next: NextFunction) {
  try {
    const loan = await loanService.getCurrentLoan(req.user!.id);
    res.json(loan);
  } catch (error) {
    next(error);
  }
}

export async function getLoanDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const loan = await loanService.getLoanById(req.params.id, req.user!.id);
    res.json(loan);
  } catch (error) {
    next(error);
  }
}
