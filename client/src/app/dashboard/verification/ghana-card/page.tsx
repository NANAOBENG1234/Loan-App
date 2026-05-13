"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { CameraCapture } from "@/components/camera/CameraCapture";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import api from "@/services/api";

export default function GhanaCardPage() {
  const router = useRouter();
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [step, setStep] = useState<"front" | "back">("front");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as const });

  const captureFront = (data: string) => {
    setFrontImage(data);
    setStep("back");
  };

  const captureBack = (data: string) => {
    setBackImage(data);
  };

  const handleUpload = async () => {
    if (!frontImage || !backImage) return;
    setLoading(true);
    try {
      const frontBlob = await (await fetch(frontImage)).blob();
      const backBlob = await (await fetch(backImage)).blob();

      const fd1 = new FormData();
      fd1.append("image", frontBlob, "card-front.jpg");
      fd1.append("type", "ghana_card_front");
      await api.post("/uploads/verify", fd1, { headers: { "Content-Type": "multipart/form-data" } });

      const fd2 = new FormData();
      fd2.append("image", backBlob, "card-back.jpg");
      fd2.append("type", "ghana_card_back");
      await api.post("/uploads/verify", fd2, { headers: { "Content-Type": "multipart/form-data" } });

      setToast({ show: true, message: "Ghana Card submitted for verification!", type: "success" });
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
        <div className="flex items-center gap-3 mb-1">
          <span className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${frontImage ? "bg-primary-500 text-white" : "bg-secondary-200 text-secondary-500"}`}>1</span>
          <span className="h-px flex-1 bg-secondary-200" />
          <span className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${backImage ? "bg-primary-500 text-white" : "bg-secondary-200 text-secondary-500"}`}>2</span>
        </div>
        <h2 className="text-xl font-bold mb-1">Ghana Card Verification</h2>
        <p className="text-sm text-secondary-500 mb-6">
          {step === "front" ? "Capture the FRONT of your Ghana Card" : "Capture the BACK of your Ghana Card"}
        </p>

        {step === "front" && !frontImage && (
          <CameraCapture facingMode="environment" onCapture={captureFront} />
        )}
        {step === "back" && !backImage && (
          <CameraCapture facingMode="environment" onCapture={captureBack} />
        )}

        {frontImage && backImage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-secondary-400 mb-1">Front</p>
                <img src={frontImage} alt="Front" className="rounded-xl w-full" />
              </div>
              <div>
                <p className="text-xs text-secondary-400 mb-1">Back</p>
                <img src={backImage} alt="Back" className="rounded-xl w-full" />
              </div>
            </div>
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
