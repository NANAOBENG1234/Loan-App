import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/HttpError";

const ALLOWED_ORIGINS = new Set([
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3000",
]);

/**
 * CSRF defense on top of SameSite=Lax: state-changing requests must either
 * carry no Origin/Referer (server-to-server integrations such as the
 * payment webhook) or come from an allowlisted origin.
 */
export function sameOriginGuard(req: Request, _res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  const headerValue = req.headers.origin || req.headers.referer;
  if (!headerValue) return next();

  let origin: string;
  try {
    origin = new URL(headerValue).origin;
  } catch {
    return next();
  }

  if (!ALLOWED_ORIGINS.has(origin)) {
    throw new HttpError(403, `Cross-origin request rejected from ${origin}`);
  }

  next();
}