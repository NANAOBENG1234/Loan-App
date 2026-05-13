"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";

interface CameraCaptureProps {
  facingMode?: "user" | "environment";
  onCapture: (imageData: string) => void;
}

export function CameraCapture({ facingMode = "user", onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsStreaming(true);
    } catch {
      setError("Camera access denied. Please allow camera permissions in your browser settings.");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const data = canvas.toDataURL("image/jpeg", 0.8);
    setPreview(data);
    stopCamera();
  }, [stopCamera]);

  const retake = useCallback(() => {
    setPreview(null);
    startCamera();
  }, [startCamera]);

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl overflow-hidden bg-black max-w-sm mx-auto">
          <img src={preview} alt="Captured" className="w-full" />
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={retake}>Retake</Button>
          <Button onClick={() => onCapture(preview)}>Use Photo</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden bg-black max-w-sm mx-auto aspect-[4/3] flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isStreaming ? "" : "opacity-0"}`}
        />
        {!isStreaming && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/50 text-sm">Camera off</p>
          </div>
        )}
        {/* Circular overlay for selfie */}
        {facingMode === "user" && isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="size-48 rounded-full border-2 border-white/50" />
          </div>
        )}
        {/* Card frame overlay for Ghana Card */}
        {facingMode === "environment" && isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-40 border-2 border-white/50 rounded-lg" />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <div className="flex justify-center">
        {!isStreaming ? (
          <Button onClick={startCamera} size="lg">Open Camera</Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={stopCamera}>Cancel</Button>
            <Button onClick={capture} size="lg">Capture</Button>
          </div>
        )}
      </div>
    </div>
  );
}
