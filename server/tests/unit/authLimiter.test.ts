import { describe, expect, it } from "vitest";
import { makeAuthKeyGenerator } from "../../src/middleware/authLimiter.util";

describe("auth rate-limit key generator", () => {
  const loginKey = makeAuthKeyGenerator("login", "phone");

  it("binds the label, IP and account into one key", () => {
    const req = { ip: "1.2.3.4", body: { phone: "0241234567" } } as any;
    expect(loginKey(req)).toBe("login:1.2.3.4:0241234567");
  });

  it("normalises the account identifier case", () => {
    const req = { ip: "1.2.3.4", body: { phone: " 0249999000 " } } as any;
    expect(loginKey(req)).toBe("login:1.2.3.4:0249999000");
  });

  it("falls back to a global bucket when the account is absent", () => {
    const req = { ip: "1.2.3.4", body: {} } as any;
    expect(loginKey(req)).toBe("login:1.2.3.4:global");
  });

  it("uses a bare IP key when no account field is configured", () => {
    const ipKey = makeAuthKeyGenerator("auth-ip", null);
    const req = { ip: "5.6.7.8", body: { phone: "whatever" } } as any;
    expect(ipKey(req)).toBe("auth-ip:5.6.7.8");
  });
});