"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-secondary-700">{label}</label>}
      <input
        ref={ref}
        className={`input-field ${error ? "ring-2 ring-red-500/30 border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="text-xs text-secondary-400">{helperText}</p>}
    </div>
  )
);

Input.displayName = "Input";
