"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "info", isVisible, onClose, duration = 3000 }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => { setShow(false); setTimeout(onClose, 300); }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-4 left-1/2 z-[100] w-[90%] max-w-md"
        >
          <div className={`${colors[type]} text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 text-sm font-medium`}>
            <span className="size-6 rounded-full bg-white/20 flex items-center justify-center text-xs">{icons[type]}</span>
            {message}
            <button onClick={() => { setShow(false); setTimeout(onClose, 300); }} className="ml-auto text-white/70 hover:text-white">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
