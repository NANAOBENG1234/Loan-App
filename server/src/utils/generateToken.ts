import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/auth.types";

export function generateToken(payload: TokenPayload, expiresIn?: string): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || "30d",
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}
