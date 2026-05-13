import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; phone: string };
      admin?: { id: string; email: string; role: string };
    }
  }
}

export {};
