import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/generateToken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Authentication required" });
    const decoded = verifyToken(token);
    if (decoded.role !== "user") return res.status(403).json({ message: "Access denied" });
    req.user = { id: decoded.id, phone: decoded.phone };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
