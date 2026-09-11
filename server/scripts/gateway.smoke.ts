/**
 * Offline smoke test for the payment gateway layer.
 * Exercises provider behavior and webhook parsing/signature logic
 * with no network and no database. Run: npm run build && node dist/scripts/gateway.smoke.js
 * or directly with: node_modules/.bin/tsx scripts/gateway.smoke.ts
 */
import assert from "assert";
import { MockPaymentProvider } from "../src/services/payments/mock.provider";
import { FlutterwaveProvider } from "../src/services/payments/flutterwave.provider";
import { getPaymentProvider, resetPaymentProvider } from "../src/services/payments";

async function main() {
  let passed = 0;
  let failed = 0;
  const check = (name: string, fn: () => void) => {
    try {
      fn();
      passed++;
      console.log(`  ok  ${name}`);
    } catch (err) {
      failed++;
      console.error(`FAIL  ${name}`, err);
    }
  };
  const checkAsync = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
      passed++;
      console.log(`  ok  ${name}`);
    } catch (err) {
      failed++;
      console.error(`FAIL  ${name}`, err);
    }
  };

  console.log("Mock provider:");
  const mock = new MockPaymentProvider();
  check("autoVerifyOnInitiate is true", () => assert.strictEqual(mock.autoVerifyOnInitiate, true));
  await checkAsync("createPayment returns reference", async () => {
    const res = await mock.createPayment({ reference: "PMT-x", amount: 100, currency: "GHS", method: "mtn", phone: "0240000000" });
    assert.strictEqual(res.reference, "PMT-x");
  });
  await checkAsync("verifyPayment is always true", async () => {
    assert.strictEqual(await mock.verifyPayment({ reference: "PMT-x", amount: 100 }), true);
  });
  check("factory resolves mock by default", () => {
    resetPaymentProvider();
    delete process.env.PAYMENT_PROVIDER;
    assert.strictEqual(getPaymentProvider().name, "mock");
  });

  console.log("Flutterwave provider (offline paths only):");
  const flw = new FlutterwaveProvider();
  check("autoVerifyOnInitiate is false", () => assert.strictEqual(flw.autoVerifyOnInitiate, false));
  await checkAsync("rejects wrong verif-hash", async () => {
    const ok = await flw.verifyWebhookSignature({ "verif-hash": "wrong" }, Buffer.from("{}"));
    assert.strictEqual(ok, false);
  });
  await checkAsync("accepts matching verif-hash", async () => {
    const old = process.env.FLUTTERWAVE_WEBHOOK_HASH;
    process.env.FLUTTERWAVE_WEBHOOK_HASH = "s3cret";
    try {
      const ok = await flw.verifyWebhookSignature({ "verif-hash": "s3cret" }, Buffer.from("{}"));
      assert.strictEqual(ok, true);
    } finally {
      if (old === undefined) delete process.env.FLUTTERWAVE_WEBHOOK_HASH;
      else process.env.FLUTTERWAVE_WEBHOOK_HASH = old;
    }
  });
  await checkAsync("parses a Flutterwave webhook payload", async () => {
    const payload = JSON.stringify({
      event: "charge.completed",
      data: { id: 483936, tx_ref: "PMT-abc", status: "successful", amount: 1250.5 },
    });
    const event = await flw.parseWebhook(Buffer.from(payload, "utf8"));
    assert.strictEqual(event.reference, "PMT-abc");
    assert.strictEqual(event.transactionId, "483936");
    assert.strictEqual(event.status, "successful");
    assert.strictEqual(event.amount, 1250.5);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});