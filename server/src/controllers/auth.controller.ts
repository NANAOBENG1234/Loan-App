import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../utils/validators";
import { cookieOptions, clearCookieOptions } from "../constants/session";

const authService = new AuthService();

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);

    res.cookie("token", result.token, cookieOptions());

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);

    res.cookie("token", result.token, cookieOptions());

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("token", clearCookieOptions());
  res.json({ message: "Logged out" });
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await authService.getProfile(req.user!.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}
