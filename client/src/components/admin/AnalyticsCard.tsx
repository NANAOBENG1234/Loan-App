"use client";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
}

export function AnalyticsCard({ title, value, subtitle, icon }: AnalyticsCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-secondary-800">{value}</p>
          {subtitle && <p className="text-xs text-secondary-400 mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );
}
