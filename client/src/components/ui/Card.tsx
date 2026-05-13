import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ glass, padding = "md", children, className = "", ...props }, ref) => {
    const paddings = { sm: "p-4", md: "p-5", lg: "p-6", none: "" };
    return (
      <div
        ref={ref}
        className={`${glass ? "glass-card" : "card"} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
