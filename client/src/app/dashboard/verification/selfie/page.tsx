"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { CameraCapture } from "@/components/camera/CameraCapture";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import api from "@/services/api";

export default function SelfiePage() {
  const router = useRouter();
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as const });

  const handleUpload = async () => {
    if (!imageData) return;
    setLoading(true);
    try {
      const blob = await (await fetch(imageData)).blob();
      const formData = new FormData();
      formData.append("image", blob, "selfie.jpg");
      formData.append("type", "selfie");

      await api.post("/uploads/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({ show: true, message: "Selfie submitted for verification!", type: "success" });
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      setToast({ show: true, message: err.response?.data?.message || "Upload failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DashboardHeader />
      <main className="max-w-lg mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-1">Selfie Verification</h2>
        <p className="text-sm text-secondary-500 mb-6">Take a clear selfie to verify your identity</p>

        <CameraCapture facingMode="user" onCapture={setImageData} />

        {imageData && (
          <div className="mt-4">
            <Button onClick={handleUpload} isLoading={loading} fullWidth>
              Submit for Verification
            </Button>
          </div>
        )}
      </main>
      <BottomNav />
      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
