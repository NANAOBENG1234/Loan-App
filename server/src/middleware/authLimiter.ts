import { rateLimit } from "express-rate-limit";
import { makeAuthKeyGenerator } from "./authLimiter.util";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const common = {
  windowMs: FIFTEEN_MINUTES,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Try again later." },
};

/**
 * Per-IP ceiling shared by all credential endpoints: prevents an attacker
 * rotating accounts/phoness from a single IP while staying under a single
 * endpoint's limit.
 */
export const authIpLimiter = rateLimit({
  ...common,
  max: Number(process.env.AUTH_IP_LIMIT_MAX || 20),
  keyGenerator: makeAuthKeyGenerator("auth-ip", null),
});

/** Per (IP, phone) for password login. */
export const loginLimiter = rateLimit({
  ...common,
  max: Number(process.env.LOGIN_LIMIT_MAX || 5),
  keyGenerator: makeAuthKeyGenerator("login", "phone"),
});

/** Per (IP, phone) for registration. */
export const registerLimiter = rateLimit({
  ...common,
  max: Number(process.env.REGISTER_LIMIT_MAX || 5),
  keyGenerator: makeAuthKeyGenerator("register", "phone"),
});

/** Per (IP, email) for the admin console login. */
export const adminLoginLimiter = rateLimit({
  ...common,
  max: Number(process.env.ADMIN_LOGIN_LIMIT_MAX || 5),
  keyGenerator: makeAuthKeyGenerator("admin-login", "email"),
});