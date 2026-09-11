export interface CreatePaymentInput {
  reference: string;
  amount: number;
  currency: "GHS";
  method: string;
  phone?: string;
  callbackUrl?: string;
}

export interface CreatePaymentResult {
  reference: string;
  paymentUrl?: string | null;
  instructions?: string | null;
}

export interface VerifyPaymentInput {
  reference: string;
  amount: number;
  transactionId?: string;
}

export interface PaymentProvider {
  readonly name: string;
  /** Mock/dev providers can auto-confirm on initiate; live providers wait for a webhook. */
  readonly autoVerifyOnInitiate: boolean;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<boolean>;
  verifyWebhookSignature(headers: Record<string, unknown>, rawBody: Buffer): Promise<boolean>;
  parseWebhook(rawBody: Buffer): Promise<{ reference: string; transactionId: string; status: string; amount?: number }>;
}

export const PAYMENT_PROVIDERS = ["mock", "flutterwave"] as const;
export type PaymentProviderName = (typeof PAYMENT_PROVIDERS)[number];