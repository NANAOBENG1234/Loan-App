import bcrypt from "bcryptjs";
import prisma from "../config/db";
import { generateToken } from "../utils/generateToken";
import { RegisterInput, LoginInput } from "../types/auth.types";

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (existing) throw new Error("Phone number already registered");

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        phone: input.phone,
        email: input.email || null,
        password: hashedPassword,
        loanLevel: 1,
      },
      select: { id: true, fullName: true, phone: true, email: true, loanLevel: true, verified: true, createdAt: true },
    });

    const token = generateToken({ id: user.id, phone: user.phone, role: "user" });
    return { user, token };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (!user || !user.isActive) throw new Error("Invalid phone number or password");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new Error("Invalid phone number or password");

    const token = generateToken({ id: user.id, phone: user.phone, role: "user" });
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, fullName: true, phone: true, email: true, avatarUrl: true,
        verified: true, loanLevel: true, createdAt: true,
        _count: { select: { loans: true, verifications: true } },
      },
    });
    if (!user) throw new Error("User not found");

    const activeLoan = await prisma.loan.findFirst({
      where: { userId, status: { in: ["active", "approved", "pending"] } },
      orderBy: { createdAt: "desc" },
    });

    return { ...user, activeLoan };
  }
}
