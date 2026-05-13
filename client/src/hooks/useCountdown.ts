"use client";

import { useState, useEffect, useCallback } from "react";
import { getCountdown, Countdown } from "@/utils/countdown";

export function useCountdown(targetDate: string | Date | null) {
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: false });

  const update = useCallback(() => {
    if (!targetDate) return;
    setCountdown(getCountdown(targetDate));
  }, [targetDate]);

  useEffect(() => {
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [update]);

  return countdown;
}
