import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error("Error:", err.message);

  if (err.name === "ZodError") {
    const zod = err as any;
    return res.status(400).json({
      message: "Validation error",
      errors: zod.errors?.map((e: any) => ({ field: e.path.join("."), message: e.message })),
    });
  }

  if ((err as any).code === "P2002") {
    return res.status(409).json({ message: "This record already exists" });
  }

  if (err.message.includes("already registered") || err.message.includes("Invalid")) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal server error" });
}
