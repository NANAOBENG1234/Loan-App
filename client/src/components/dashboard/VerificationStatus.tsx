"use client";

import { Verification } from "@/types/user.types";
import {
  getAllVerificationDocs,
  VERIFICATION_DOC_LABELS,
  verificationChipClass,
} from "@/utils/verificationStatus";

interface VerificationStatusProps {
  verifications: Verification[];
}

export function VerificationStatus({ verifications }: VerificationStatusProps) {
  const docs = getAllVerificationDocs(verifications);

  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Verification Status</h3>
      <div className="space-y-3">
        {docs.map((doc) => (
          <div key={doc.key} className="flex items-center justify-between">
            <span className="text-sm text-secondary-500">{VERIFICATION_DOC_LABELS[doc.key]}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${verificationChipClass(doc.status)}`}>
              {doc.status === "" ? "Not submitted" : doc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}