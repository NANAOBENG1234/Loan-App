"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import { Verification } from "@/types/user.types";
import {
  getAllVerificationDocs,
  verificationProgress,
  VERIFICATION_DOC_LABELS,
  VERIFICATION_DOC_ROUTES,
  verificationChipClass,
} from "@/utils/verificationStatus";
import { formatDateTime } from "@/utils/formatDate";

export default function VerificationPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAuthenticated) {
      userService.getVerifications().then(setVerifications).finally(() => setLoading(false));
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <Loader fullScreen />;

  const docs = getAllVerificationDocs(verifications);
  const progress = verificationProgress(verifications);
  const allApproved = progress.done === progress.total;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DashboardHeader />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <h2 className="text-xl font-bold">Verification</h2>
        <p className="text-sm text-secondary-500">Upload all three documents to fully verify your identity and unlock loans.</p>

        {allApproved ? (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 font-medium">
            You&apos;re fully verified — you can apply for loans.
          </div>
        ) : (
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary-700">Verification progress</span>
              <span className="text-sm font-semibold text-secondary-800">{progress.done}/{progress.total} documents</span>
            </div>
            <div className="h-2 rounded-full bg-secondary-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-500 transition-all"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {docs.map((doc) => {
            const needsAction = !doc.submitted || doc.status === "rejected";
            const showNote = doc.status === "rejected" && doc.adminNote;
            return (
              <div key={doc.key} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-secondary-800">{VERIFICATION_DOC_LABELS[doc.key]}</p>
                    {doc.submittedAt && (
                      <p className="text-xs text-secondary-400 mt-0.5">
                        {doc.status === "approved" && doc.reviewedAt
                          ? `Verified ${formatDateTime(doc.reviewedAt)}`
                          : `Submitted ${formatDateTime(doc.submittedAt)}`}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${verificationChipClass(doc.status)}`}>
                    {doc.status === "" ? "Not submitted" : doc.status}
                  </span>
                </div>
                {showNote && (
                  <p className="text-xs text-red-600 mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    Reason: {doc.adminNote}
                  </p>
                )}
                {needsAction && (
                  <Button
                    size="sm"
                    variant={doc.status === "rejected" ? "primary" : "secondary"}
                    className="mt-3"
                    onClick={() => router.push(VERIFICATION_DOC_ROUTES[doc.key])}
                  >
                    {doc.status === "rejected" ? "Resubmit" : "Upload"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}