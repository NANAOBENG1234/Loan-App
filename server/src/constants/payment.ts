export interface MoMoProvider {
  name: string;
  number: string;
  accountName: string;
  color: string;
}

export const MOMO_DETAILS: Record<string, MoMoProvider> = {
  mtn: { name: "MTN Mobile Money", number: "055 123 4567", accountName: "BoA Micro Finance Ltd", color: "#FFC107" },
  vodafone: { name: "Vodafone Cash", number: "020 123 4567", accountName: "BoA Micro Finance Ltd", color: "#E53935" },
  airteltigo: { name: "AirtelTigo Money", number: "027 123 4567", accountName: "BoA Micro Finance Ltd", color: "#1E88E5" },
};

export const SUPPORTED_PAYMENT_METHODS = ["mtn", "vodafone", "airteltigo"];