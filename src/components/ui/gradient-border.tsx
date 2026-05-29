"use client";

import { useRef } from "react";

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  /** Animate the gradient rotation */
  animated?: boolean;
}

export default function GradientBorder({
  children,
  className = "",
  borderWidth = 1,
  animated = true,
}: GradientBorderProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl p-[${borderWidth}px] ${className}`}
      style={{ padding: `${borderWidth}px` }}
    >
      {/* Gradient border layer */}
      <div
        className={`
          absolute inset-0 rounded-2xl
          bg-[conic-gradient(from_var(--gradient-angle),var(--accent)_0%,transparent_25%,transparent_75%,var(--accent)_100%)]
          opacity-40
          ${animated ? "animate-gradient-rotate" : ""}
        `}
        style={
          { "--gradient-angle": "0deg" } as React.CSSProperties
        }
      />
      {/* Content */}
      <div className="relative rounded-2xl bg-[var(--surface-1)] h-full">
        {children}
      </div>
    </div>
  );
}
