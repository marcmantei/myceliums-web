"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TerminalFrame from "@/components/ui/terminal-frame";

gsap.registerPlugin(ScrollTrigger);

interface BeforeAfterDemoProps {
  beforeTitle: string;
  beforeLines: string[];
  afterTitle: string;
  afterLines: string[];
}

function ScrollTypedTerminal({
  lines,
  variant,
  title,
}: {
  lines: string[];
  variant: "error" | "success";
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const lineEls = containerRef.current.querySelectorAll(".typed-line");

      lineEls.forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 5 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top+=${(i / lines.length) * 60}% bottom`,
            end: `top+=${((i + 1) / lines.length) * 60}% bottom`,
            scrub: 0.3,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <TerminalFrame title={title} variant={variant}>
      <div ref={containerRef} className="space-y-0.5 min-h-[250px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`typed-line font-mono text-xs sm:text-sm whitespace-pre ${
              line.startsWith("$")
                ? variant === "error"
                  ? "text-red-400"
                  : "text-emerald-400"
                : line.startsWith("✓")
                  ? "text-emerald-400 font-semibold"
                  : line.startsWith("...")
                    ? "text-red-400/70 italic"
                    : line.startsWith("Result:")
                      ? variant === "error"
                        ? "text-red-400/90 font-semibold"
                        : "text-emerald-400 font-semibold"
                      : line.startsWith("Tokens spent:")
                        ? variant === "error"
                          ? "text-red-400/60 text-[11px]"
                          : "text-emerald-400/70 text-[11px]"
                        : line.startsWith("Tool")
                          ? "text-emerald-300/80"
                          : "text-text-secondary"
            }`}
          >
            {line}
          </div>
        ))}
      </div>
    </TerminalFrame>
  );
}

export default function BeforeAfterDemo({
  beforeTitle,
  beforeLines,
  afterTitle,
  afterLines,
}: BeforeAfterDemoProps) {
  return (
    <div className="relative grid md:grid-cols-2 gap-4 lg:gap-6">
      <ScrollTypedTerminal
        lines={beforeLines}
        variant="error"
        title={beforeTitle}
      />
      {/* VS badge */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-14 h-14 rounded-full bg-surface-3 border border-white/10 flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-text-secondary tracking-wide leading-none -mt-0.5">&raquo;</span>
        </div>
      </div>
      <ScrollTypedTerminal
        lines={afterLines}
        variant="success"
        title={afterTitle}
      />
    </div>
  );
}
