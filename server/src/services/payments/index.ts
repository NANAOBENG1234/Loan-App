import { PaymentProvider, PaymentProviderName } from "./types";
import { MockPaymentProvider } from "./mock.provider";
import { FlutterwaveProvider } from "./flutterwave.provider";

let instance: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (instance) return instance;
  const configured = process.env.PAYMENT_PROVIDER || "mock";
  const name: PaymentProviderName = configured === "flutterwave" ? "flutterwave" : "mock";
  instance = name === "flutterwave" ? new FlutterwaveProvider() : new MockPaymentProvider();
  return instance;
}

export function resetPaymentProvider() {
  instance = null;
}