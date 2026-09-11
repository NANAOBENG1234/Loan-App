import { CreatePaymentInput, CreatePaymentResult, PaymentProvider, VerifyPaymentInput } from "./types";
import { HttpError } from "../../utils/HttpError";
import { logger } from "../../utils/logger";

const METHOD_TO_NETWORK: Record<string, string> = {
  mtn: "MTN",
  vodafone: "Vodafone",
  airteltigo: "AirtelTigo",
};

/** Ghana Mobile Money via Flutterwave (mobile_money_ghana). */
export class FlutterwaveProvider implements PaymentProvider {
  readonly name = "flutterwave";
  readonly autoVerifyOnInitiate = false;

  private baseUrl = "https://api.flutterwave.com/v3";

  private get secretKey(): string {
    const key = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!key) throw new HttpError(503, "Payment provider is not configured");
    return key;
  }

  private get webhookHash(): string {
    return process.env.FLUTTERWAVE_WEBHOOK_HASH || "dev-webhook-secret";
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const network = METHOD_TO_NETWORK[input.method] || "MTN";

    const body = {
      tx_ref: input.reference,
      amount: input.amount,
      currency: input.currency,
      payment_type: "mobile_money_ghana",
      network,
      phone_number: input.phone,
      redirect_url: input.callbackUrl || process.env.CLIENT_URL || "http://localhost:3000",
    };

    const res = await fetch(`${this.baseUrl}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      logger.error("Flutterwave createPayment failed:", JSON.stringify(json));
      throw new HttpError(502, "Payment provider failed to create payment");
    }

    return {
      reference: input.reference,
      paymentUrl: json?.data?.link || null,
      instructions: null,
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<boolean> {
    if (!input.transactionId) return false;
    try {
      const res = await fetch(`${this.baseUrl}/transactions/${input.transactionId}/verify`, {
        headers: { Authorization: `Bearer ${this.secretKey}` },
      });
const json: any = await res.json().catch(() => ({}));
      if (!res.ok || json?.status !== "success") return false;
      const txn = json?.data;
      return txn?.status === "successful" && Math.abs(Number(txn?.amount) - input.amount) <= 0.01;
    } catch (error) {
      logger.error("Flutterwave verifyPayment error:", error);
      return false;
    }
  }

  async verifyWebhookSignature(headers: Record<string, unknown>, _rawBody: Buffer): Promise<boolean> {
    const hash = headers["verif-hash"];
    return typeof hash === "string" && hash === this.webhookHash;
  }

  async parseWebhook(rawBody: Buffer): Promise<{ reference: string; transactionId: string; status: string; amount?: number }> {
    const body = JSON.parse(rawBody.toString("utf8"));
    const data = body?.data || {};
    return {
      reference: String(data?.tx_ref || ""),
      transactionId: String(data?.id || ""),
      status: String(data?.status || body?.event || ""),
      amount: data?.amount ? Number(data.amount) : undefined,
    };
  }
}