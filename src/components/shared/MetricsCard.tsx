"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MetricItem {
  label: string;
  value: string;
  improvement: string;
}

interface MetricsCardProps {
  metrics: MetricItem[];
}

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useGSAP(
    () => {
      if (!ref.current) return;

      gsap.from(ref.current, {
        opacity: 0,
        y: 10,
        duration: 0.6,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          onEnter: () => setIsAnimating(true),
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="text-2xl md:text-3xl font-bold text-accent">
      {value}
    </div>
  );
}

export default function MetricsCard({ metrics }: MetricsCardProps) {
  const hasFootnote = metrics.some((m) => m.improvement.includes("*"));

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mt-8">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="p-4 lg:p-6 rounded-lg border border-border bg-surface/50 backdrop-blur-sm hover:border-accent/40 transition-colors"
          >
            <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-2">
              {metric.label}
            </p>
            <AnimatedCounter value={metric.value} />
            <p className="text-sm text-text-secondary mt-2">{metric.improvement}</p>
          </div>
        ))}
      </div>
      {hasFootnote && (
        <p className="text-xs text-text-tertiary mt-3">
          * Measured on standardized queries (caller lookup, blast radius, symbol search) across 6 open-source repos.{" "}
          <a
            href="https://github.com/marcmantei/myceliums/tree/main/benchmarks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/60 hover:text-accent transition-colors"
          >
            See methodology
          </a>
        </p>
      )}
    </div>
  );
}
