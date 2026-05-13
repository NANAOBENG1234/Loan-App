"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import api from "@/services/api";

interface VerificationFormProps {
  type: "selfie" | "ghana_card_front" | "ghana_card_back";
  imageData: string | File;
  onSuccess: () => void;
}

export function VerificationForm({ type, imageData, onSuccess }: VerificationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as const });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("type", type);
      if (typeof imageData === "string") {
        const blob = await (await fetch(imageData)).blob();
        formData.append("image", blob, "capture.jpg");
      } else {
        formData.append("image", imageData);
      }

      await api.post("/uploads/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setToast({ show: true, message: "Submitted for verification!", type: "success" });
      setTimeout(onSuccess, 1000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Upload failed";
      setError(msg);
      setToast({ show: true, message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <Button onClick={handleSubmit} isLoading={loading} fullWidth>
        Submit for Verification
      </Button>
      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
