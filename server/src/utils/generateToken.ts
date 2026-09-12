import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/auth.types";

export function generateToken(payload: TokenPayload, expiresIn?: string): string {
  const options: jwt.SignOptions = {
    expiresIn: (expiresIn || process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(payload, process.env.JWT_SECRET!, options);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}
