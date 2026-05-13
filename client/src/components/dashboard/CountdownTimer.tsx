"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  dueDate: string | Date;
}

export function CountdownTimer({ dueDate }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(dueDate);

  if (isExpired) {
    return (
      <div className="text-center py-3">
        <span className="chip chip-overdue">Overdue</span>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex gap-2 justify-center">
        {[
          { value: days, label: "Days" },
          { value: hours, label: "Hrs" },
          { value: minutes, label: "Min" },
          { value: seconds, label: "Sec" },
        ].map((unit) => (
          <div key={unit.label} className="bg-secondary-50 rounded-xl px-3 py-2 min-w-[56px]">
            <div className="text-xl font-bold text-secondary-800">{String(unit.value).padStart(2, "0")}</div>
            <div className="text-[10px] text-secondary-400 font-medium">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
