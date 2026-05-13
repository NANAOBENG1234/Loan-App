export const LOAN_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  ACTIVE: "active",
  REPAID: "repaid",
  OVERDUE: "overdue",
  REJECTED: "rejected",
  EXPIRED: "expired",
} as const;

export const REPAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  OVERDUE: "overdue",
} as const;

export const VERIFICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const VERIFICATION_TYPE = {
  SELFIE: "selfie",
  GHANA_CARD_FRONT: "ghana_card_front",
  GHANA_CARD_BACK: "ghana_card_back",
} as const;
