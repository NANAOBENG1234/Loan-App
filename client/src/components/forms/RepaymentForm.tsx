"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { paymentService } from "@/services/payment.service";
import { MOMO_DETAILS } from "@/utils/constants";

interface RepaymentFormProps {
  loanId: string;
  amount: number;
  onSuccess: () => void;
}

interface Checkout {
  provider: string;
  paymentUrl?: string | null;
  instructions?: string | null;
  verified?: boolean;
  confirmed?: boolean;
}

export function RepaymentForm({ loanId, amount, onSuccess }: RepaymentFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  useEffect(() => {
    paymentService.getMethods().catch(() => {});
  }, []);

  const handleProviderClick = (provider: string) => {
    setSelectedProvider(provider);
    setCheckout(null);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await paymentService.initiate(loanId, amount, selectedProvider || undefined);
      const next: Checkout = result.checkout;
      setCheckout(next);

      if (next.confirmed) {
        setToast({ show: true, message: "Payment confirmed.", type: "success" });
        setShowModal(false);
        setTimeout(onSuccess, 1000);
        return;
      }

      if (next.paymentUrl) {
        window.open(next.paymentUrl, "_blank", "noopener,noreferrer");
        setToast({ show: true, message: "Payment initiated. Complete it on the gateway page.", type: "success" });
        setTimeout(onSuccess, 1200);
      } else {
        setToast({ show: true, message: "Payment recorded. Awaiting confirmation.", type: "success" });
        setShowModal(false);
        setTimeout(onSuccess, 1000);
      }
    } catch (err: any) {
      setToast({ show: true, message: err.response?.data?.message || "Payment failed", type: "error" });
      setCheckout(null);
    } finally {
      setLoading(false);
    }
  };

  const openGateway = () => {
    if (checkout?.paymentUrl) window.open(checkout.paymentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="space-y-3">
        <p className="text-sm font-medium text-secondary-700 mb-3">Pay via Mobile Money</p>
        {Object.entries(MOMO_DETAILS).map(([key, provider]) => (
          <button
            key={key}
            onClick={() => handleProviderClick(key)}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-secondary-200 hover:border-primary-500 hover:bg-primary-50/50 transition-all active:scale-[0.99]"
          >
            <div className="size-12 rounded-xl flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: provider.color }}>
              {provider.name.charAt(0)}
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-sm">{provider.name}</p>
              <p className="text-xs text-secondary-400">{provider.number}</p>
            </div>
            <svg className="size-5 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Payment">
        {selectedProvider && (
          <div className="space-y-4">
            <div className="bg-soft-green rounded-xl p-4 text-sm">
              <p className="font-medium mb-2">Send exactly:</p>
              <p className="text-2xl font-bold text-primary-700">GHS {amount.toFixed(2)}</p>
            </div>

            {checkout?.paymentUrl ? (
              <div className="space-y-3">
                <div className="bg-soft-green rounded-xl p-3 text-sm text-secondary-700">
                  <p className="font-semibold mb-1">Gateway checkout created</p>
                  <p>You&apos;ll complete the payment on the gateway page. Your loan clears automatically once the payment is confirmed.</p>
                </div>
                {checkout.instructions && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">{checkout.instructions}</div>
                )}
                <Button onClick={openGateway} fullWidth size="lg">
                  Continue on {MOMO_DETAILS[selectedProvider as keyof typeof MOMO_DETAILS]?.name} Gateway
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Provider</span>
                    <span className="font-medium">{MOMO_DETAILS[selectedProvider as keyof typeof MOMO_DETAILS]?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Number</span>
                    <span className="font-medium">{MOMO_DETAILS[selectedProvider as keyof typeof MOMO_DETAILS]?.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Account Name</span>
                    <span className="font-medium">{MOMO_DETAILS[selectedProvider as keyof typeof MOMO_DETAILS]?.accountName}</span>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
                  After sending payment, click confirm below. The admin will verify and clear your loan.
                </div>
                <Button onClick={handleConfirm} isLoading={loading} fullWidth size="lg">
                  {checkout?.confirmed ? "Payment Confirmed" : "I&apos;ve Sent the Payment"}
                </Button>
              </>
            )}
          </div>
        )}
      </Modal>

      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </>
  );
}