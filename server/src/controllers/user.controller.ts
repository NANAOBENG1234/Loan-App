import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, phone, gender, dateOfBirth } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { firstName, lastName, phone, gender, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined },
      select: {
        id: true, email: true, phone: true, firstName: true,
        lastName: true, gender: true, dateOfBirth: true, avatarUrl: true,
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { notificationsEnabled, preferredLanguage } = req.body;
    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user!.id },
      update: { notificationsEnabled, preferredLanguage },
      create: { userId: req.user!.id, notificationsEnabled, preferredLanguage },
    });
    res.json(settings);
  } catch (error) {
    next(error);
  }
}
