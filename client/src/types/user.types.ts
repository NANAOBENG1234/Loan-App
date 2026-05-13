export interface Verification {
  id: string;
  userId: string;
  type: "selfie" | "ghana_card_front" | "ghana_card_back";
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
  adminNote?: string | null;
  reviewedBy?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
  user?: { fullName: string; phone: string };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}
