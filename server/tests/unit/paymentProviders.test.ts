import { describe, expect, it, beforeEach } from "vitest";
import { MockPaymentProvider } from "../../src/services/payments/mock.provider";
import { FlutterwaveProvider } from "../../src/services/payments/flutterwave.provider";
import { getPaymentProvider, resetPaymentProvider } from "../../src/services/payments/index";
import { HttpError } from "../../src/utils/HttpError";

describe("payment provider factory", () => {
  beforeEach(() => {
    delete process.env.PAYMENT_PROVIDER;
    delete process.env.FLUTTERWAVE_SECRET_KEY;
    resetPaymentProvider();
  });

  it("defaults to the mock provider", () => {
    expect(getPaymentProvider().name).toBe("mock");
    expect(getPaymentProvider().autoVerifyOnInitiate).toBe(true);
  });

  it("selects flutterwave when configured", () => {
    process.env.PAYMENT_PROVIDER = "flutterwave";
    process.env.FLUTTERWAVE_SECRET_KEY = "FLWSECK-test";
    expect(getPaymentProvider().name).toBe("flutterwave");
  });

  it("falls back to mock for unknown names without having paid calls", () => {
    process.env.PAYMENT_PROVIDER = "paystack";
    expect(getPaymentProvider().name).toBe("mock");
  });
});

describe("MockPaymentProvider", () => {
  const provider = new MockPaymentProvider();

  it("echoes the reference and never produces a payment URL", async () => {
    const result = await provider.createPayment({
      reference: "ref-1",
      amount: 100,
      currency: "GHS",
      method: "mtn",
    });
    expect(result.reference).toBe("ref-1");
    expect(result.paymentUrl).toBeNull();
  });

  it("auto-verifies without a transaction id", async () => {
    await expect(provider.verifyPayment({ reference: "ref-1", amount: 100 })).resolves.toBe(true);
  });

  it("rejects webhook signature verification", async () => {
    await expect(provider.verifyWebhookSignature({}, Buffer.from("{}"))).resolves.toBe(false);
  });
});

describe("FlutterwaveProvider", () => {
  const provider = new FlutterwaveProvider();

  it("verifies the verif-hash header", async () => {
    process.env.FLUTTERWAVE_WEBHOOK_HASH = "webhook-hash-123";
    await expect(provider.verifyWebhookSignature({ "verif-hash": "webhook-hash-123" }, Buffer.alloc(0))).resolves.toBe(true);
    await expect(provider.verifyWebhookSignature({ "verif-hash": "tampered" }, Buffer.alloc(0))).resolves.toBe(false);
    await expect(provider.verifyWebhookSignature({}, Buffer.alloc(0))).resolves.toBe(false);
  });

  it("parses the webhook payload shape", async () => {
    const body = Buffer.from(
      JSON.stringify({
        event: "charge.completed",
        data: {
          id: "txn-42",
          tx_ref: "loan-ref-7",
          status: "successful",
          amount: "132.50",
        },
      })
    );
    await expect(provider.parseWebhook(body)).resolves.toEqual({
      reference: "loan-ref-7",
      transactionId: "txn-42",
      status: "successful",
      amount: 132.5,
    });
  });

  it("throws a 503 when the secret key is missing", async () => {
    delete process.env.FLUTTERWAVE_SECRET_KEY;
    await expect(
      provider.createPayment({ reference: "r", amount: 1, currency: "GHS", method: "mtn" })
    ).rejects.toMatchObject({ status: 503 });
  });

  it("throws HttpError status 503 exactly", async () => {
    delete process.env.FLUTTERWAVE_SECRET_KEY;
    try {
      await provider.createPayment({ reference: "r", amount: 1, currency: "GHS", method: "mtn" });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(503);
    }
  });
});