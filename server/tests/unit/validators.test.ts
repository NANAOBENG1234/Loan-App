import { describe, expect, it } from "vitest";
import {
  registerSchema,
  loginSchema,
  loanApplicationSchema,
  repaymentSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../../src/utils/validators";

describe("registerSchema", () => {
  it("accepts a valid Ghana mobile number and rejects invalid ones", () => {
    expect(registerSchema.safeParse({ fullName: "Jane Doe", phone: "0241234567", password: "secret1" }).success).toBe(true);
    expect(registerSchema.safeParse({ fullName: "A", phone: "0241234567", password: "secret1" }).success).toBe(false);
    expect(registerSchema.safeParse({ fullName: "Jane", phone: "0111234567", password: "secret1" }).success).toBe(false);
    expect(registerSchema.safeParse({ fullName: "Jane", phone: "024123456", password: "secret1" }).success).toBe(false);
  });

  it("enforces a minimum 6-character password", () => {
    expect(registerSchema.safeParse({ fullName: "Jane", phone: "0241234567", password: "12345" }).success).toBe(false);
  });
});

describe("loanApplicationSchema", () => {
  it("requires a positive amount and caps it at GHS 10,000", () => {
    expect(loanApplicationSchema.safeParse({ amount: 100 }).success).toBe(true);
    expect(loanApplicationSchema.safeParse({ amount: 0 }).success).toBe(false);
    expect(loanApplicationSchema.safeParse({ amount: -5 }).success).toBe(false);
    expect(loanApplicationSchema.safeParse({ amount: 10001 }).success).toBe(false);
  });
});

describe("repaymentSchema", () => {
  it("requires a loanId and positive amount", () => {
    expect(repaymentSchema.safeParse({ loanId: "abc", amount: 50 }).success).toBe(true);
    expect(repaymentSchema.safeParse({ amount: 50 }).success).toBe(false);
    expect(repaymentSchema.safeParse({ loanId: "abc", amount: 0 }).success).toBe(false);
  });
});

describe("profile & password schemas", () => {
  it("accepts optional email null, rejects bad email", () => {
    expect(updateProfileSchema.safeParse({ email: null }).success).toBe(true);
    expect(updateProfileSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });

  it("changePasswordSchema requires both fields", () => {
    expect(changePasswordSchema.safeParse({ currentPassword: "oldpass", newPassword: "newpass1" }).success).toBe(true);
    expect(changePasswordSchema.safeParse({ newPassword: "newpass1" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires phone and password", () => {
    expect(loginSchema.safeParse({ phone: "0241234567", password: "x" }).success).toBe(true);
    expect(loginSchema.safeParse({ password: "x" }).success).toBe(false);
  });
});