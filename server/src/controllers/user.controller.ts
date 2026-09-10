import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, phone, email } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
      },
      select: {
        id: true, fullName: true, email: true, phone: true,
        avatarUrl: true, verified: true, loanLevel: true,
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
}
