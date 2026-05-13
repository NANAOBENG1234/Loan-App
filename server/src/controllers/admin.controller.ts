import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db";
import { generateToken } from "../utils/generateToken";
import { LoanService } from "../services/loan.service";
import { PaymentService } from "../services/payment.service";

const loanService = new LoanService();
const paymentService = new PaymentService();

export async function adminLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.isActive) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(
      { id: admin.id, phone: admin.email, role: admin.role },
      process.env.ADMIN_JWT_EXPIRES_IN
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safe } = admin;
    res.json({ admin: safe, token });
  } catch (error) {
    next(error);
  }
}

export async function getDashboardStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const [totalUsers, totalLoans, activeLoans, pendingLoans, repaidLoans, totalVerified] = await Promise.all([
      prisma.user.count(),
      prisma.loan.count(),
      prisma.loan.count({ where: { status: "active" } }),
      prisma.loan.count({ where: { status: "pending" } }),
      prisma.loan.count({ where: { status: "repaid" } }),
      prisma.user.count({ where: { verified: true } }),
    ]);

    const loanAmounts = await prisma.loan.aggregate({ _sum: { amount: true } });

    res.json({
      totalUsers, totalLoans, activeLoans, pendingLoans, repaidLoans,
      totalVerified, totalLoanAmount: loanAmounts._sum.amount || 0,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, fullName: true, phone: true, email: true, verified: true,
        isActive: true, loanLevel: true, createdAt: true,
        _count: { select: { loans: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getAllLoans(_req: Request, res: Response, next: NextFunction) {
  try {
    const loans = await prisma.loan.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { fullName: true, phone: true } } },
    });
    res.json(loans);
  } catch (error) {
    next(error);
  }
}

export async function approveLoan(req: Request, res: Response, next: NextFunction) {
  try {
    const loan = await loanService.approveLoan(req.params.id, req.admin!.id);
    res.json(loan);
  } catch (error) {
    next(error);
  }
}

export async function rejectLoan(req: Request, res: Response, next: NextFunction) {
  try {
    const loan = await loanService.rejectLoan(req.params.id);
    res.json(loan);
  } catch (error) {
    next(error);
  }
}

export async function getVerifications(_req: Request, res: Response, next: NextFunction) {
  try {
    const verifications = await prisma.verification.findMany({
      orderBy: { submittedAt: "desc" },
      include: { user: { select: { fullName: true, phone: true } } },
    });
    res.json(verifications);
  } catch (error) {
    next(error);
  }
}

export async function approveVerification(req: Request, res: Response, next: NextFunction) {
  try {
    const verification = await prisma.verification.update({
      where: { id: req.params.id },
      data: { status: "approved", reviewedBy: req.admin!.id, reviewedAt: new Date() },
    });

    await prisma.user.update({
      where: { id: verification.userId },
      data: { verified: true },
    });

    res.json(verification);
  } catch (error) {
    next(error);
  }
}

export async function rejectVerification(req: Request, res: Response, next: NextFunction) {
  try {
    const { adminNote } = req.body;
    const verification = await prisma.verification.update({
      where: { id: req.params.id },
      data: { status: "rejected", adminNote, reviewedBy: req.admin!.id, reviewedAt: new Date() },
    });
    res.json(verification);
  } catch (error) {
    next(error);
  }
}

export async function getAllRepayments(_req: Request, res: Response, next: NextFunction) {
  try {
    const repayments = await paymentService.getAllRepayments();
    res.json(repayments);
  } catch (error) {
    next(error);
  }
}

export async function clearRepayment(req: Request, res: Response, next: NextFunction) {
  try {
    const repayment = await paymentService.clearRepayment(req.params.id, req.admin!.id);
    res.json(repayment);
  } catch (error) {
    next(error);
  }
}

export async function updateUserLevel(req: Request, res: Response, next: NextFunction) {
  try {
    const { level } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { loanLevel: level },
      select: { id: true, fullName: true, loanLevel: true },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
}
