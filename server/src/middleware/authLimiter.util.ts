import { Request } from "express";

/** Pure key builder for per-account rate limits: label + IP + optional account. */
export function makeAuthKeyGenerator(label: string, accountField: string | null) {
  return (req: Request) => {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    if (accountField) {
      const account = String((req.body || {})[accountField] || "global").trim().toLowerCase();
      return `${label}:${ip}:${account}`;
    }
    return `${label}:${ip}`;
  };
}