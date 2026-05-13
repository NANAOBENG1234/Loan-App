"use client";

import { Verification } from "@/types/user.types";

interface VerificationStatusProps {
  verifications: Verification[];
}

export function VerificationStatus({ verifications }: VerificationStatusProps) {
  const selfie = verifications.find((v) => v.type === "selfie");
  const ghanaCardFront = verifications.find((v) => v.type === "ghana_card_front");
  const ghanaCardBack = verifications.find((v) => v.type === "ghana_card_back");

  const ghanaCardStatus = ghanaCardFront?.status || ghanaCardBack?.status;

  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Verification Status</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary-500">Selfie</span>
          {!selfie ? (
            <span className="text-xs text-secondary-400">Not submitted</span>
          ) : (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              selfie.status === "approved" ? "bg-green-100 text-green-700" :
              selfie.status === "rejected" ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {selfie.status}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary-500">Ghana Card</span>
          {!ghanaCardFront && !ghanaCardBack ? (
            <span className="text-xs text-secondary-400">Not submitted</span>
          ) : (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              ghanaCardStatus === "approved" ? "bg-green-100 text-green-700" :
              ghanaCardStatus === "rejected" ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {ghanaCardStatus || "pending"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
