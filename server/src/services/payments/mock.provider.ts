import { CreatePaymentInput, CreatePaymentResult, PaymentProvider, VerifyPaymentInput } from "./types";

/** Dev/test provider: auto-confirms payments and never shells out to a gateway. */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";
  readonly autoVerifyOnInitiate = true;

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    return {
      reference: input.reference,
      paymentUrl: null,
      instructions: "Mock gateway: payment is auto-confirmed for local development.",
    };
  }

  async verifyPayment(_input: VerifyPaymentInput): Promise<boolean> {
    return true;
  }

  async verifyWebhookSignature(_headers: Record<string, unknown>, _rawBody: Buffer): Promise<boolean> {
    return false;
  }

  async parseWebhook(_rawBody: Buffer): Promise<{ reference: string; transactionId: string; status: string; amount?: number }> {
    throw new Error("Mock provider does not receive webhooks");
  }
}