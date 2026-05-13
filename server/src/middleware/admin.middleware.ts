import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/generateToken";

export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.admin_token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Admin authentication required" });
    const decoded = verifyToken(token);
    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return res.status(403).json({ message: "Admin access denied" });
    }
    req.admin = { id: decoded.id, email: decoded.phone, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.admin?.role !== "superadmin") {
    return res.status(403).json({ message: "Super admin access required" });
  }
  next();
}
