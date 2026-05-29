"use client";

import { useRef } from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hoverGlow = true,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hoverGlow || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`
        relative overflow-hidden rounded-2xl
        backdrop-blur-xl bg-black/10
        border border-white/[0.06]
        transition-colors duration-300
        ${hoverGlow ? "hover:border-white/[0.12] glass-card-glow" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
