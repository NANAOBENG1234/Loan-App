import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import { updateProfileSchema } from "../utils/validators";

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
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
